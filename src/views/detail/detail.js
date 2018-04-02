import {mapActions, mapState} from 'vuex';
import _ from 'lodash';
import Hammer from 'hammerjs';

import ImageView from '../../components/ImageView';
import Loading from '../../components/Loading';
import {getDate, getDefaultColors, waitFor} from '../../helpers/util';
import FontMetrics from 'web-font-metrics';

const colors = getDefaultColors();
const chapterGroupLimit = 100;

const titleHeight = 30;
const footerHeight = 20;

export default {
  components: {
    ImageView,
    Loading,
  },
  data() {
    const themes = _.map(colors, (v, k) => {
      const {backgroundColor} = v;
      return {
        backgroundColor,
        name: k,
      };
    });
    return {
      mode: -1,
      book: null,
      title: '...',
      updatedAt: '',
      chaptersInfo: null,
      content: '',
      isShowingSetting: false,
      currentReadInfo: null,
      showReload: false,
      themes,
    };
  },
  computed: {
    ...mapState({
      userSetting: ({user}) => user.setting,
      userFavs: ({user}) => user.favs,
    }),
    favAdded() {
      const {userFavs, $route} = this;
      const {no} = $route.params;
      return !!_.find(userFavs, item => item.no === no);
    },
  },
  methods: {
    ...mapActions([
      'bookGetDetail',
      'bookChapterList',
      'bookChapterDetail',
      'userGetReadInfo',
      'userSaveReadInfo',
      'userSaveSetting',
      'userFavsToggle',
    ]),
    // 返回
    back() {
      const {steps, $router} = this;
      this.isShowingSetting = false;
      if (steps.length === 0) {
        $router.back();
        return;
      }
      const step = steps.pop();
      this.backTrigger = true;
      this.mode = step;
    },
    // 获取配置信息
    getSetting() {
      const {userSetting, $refs} = this;
      const {fontSize} = userSetting;
      const dom = $refs.chapterContent;
      const width = dom.clientWidth;
      const defaultPadding = 20;
      const fontCount = _.ceil((width - 2 * defaultPadding) / fontSize);
      const padding = _.floor((width - fontCount * fontSize) / 2);
      return _.extend(
        {
          width,
          height: dom.clientHeight,
          padding,
          fontSize,
          maxWidth: width + 10,
        },
        colors[userSetting.theme],
      );
    },
    // 调整字体大小
    async changeFontSize(offset) {
      const {userSetting} = this;
      const fontSize = userSetting.fontSize + offset;
      const minFontSize = 16;
      const maxFontSize = 28;
      if (fontSize < minFontSize || fontSize > maxFontSize) {
        this.$toast(`字体大小须设置为${minFontSize}至${maxFontSize}之间`);
        return;
      }
      try {
        await this.userSaveSetting({
          fontSize,
        });
        // 字体有调整需要重置 font metrics
        this.fontMetrics = null;
        this.changeChapter(0);
      } catch (err) {
        this.$toast(err);
      }
    },
    // 调整主题
    async changeTheme(theme) {
      try {
        await this.userSaveSetting({
          theme,
        });
        this.changeChapter(0);
      } catch (err) {
        this.$toast(err);
      }
    },
    async toggleNightTheme() {
      const {userSetting} = this;
      let theme = 'black';
      let nightMode = true;
      if (userSetting.nightMode) {
        theme = userSetting.prevTheme;
        nightMode = false;
      }
      try {
        await this.userSaveSetting({
          theme,
          nightMode,
          prevTheme: userSetting.theme,
        });
        this.changeChapter(0);
      } catch (err) {
        this.$toast(err);
      }
    },
    getFontMetrics() {
      if (!this.fontMetrics) {
        const {
          padding,
          fontSize,
          color,
          width,
          height,
          lineHeight,
        } = this.getSetting();
        this.fontMetrics = new FontMetrics({
          width: width - 2 * padding,
          height: height - titleHeight - footerHeight,
          lineHeight,
          fontSize,
          format: 'html',
          color,
        });
      }
      return this.fontMetrics;
    },
    // 显示章节内容
    showChapter(content, pageIndex) {
      const {currentReadInfo} = this;
      const {title, chapterNo} = currentReadInfo;
      const dom = this.$refs.chapterContent;
      const fontMetrics = this.getFontMetrics();
      const result = fontMetrics.getFillTextList(content);
      const max = result.length;
      let currentPage = pageIndex;
      if (currentPage < 0) {
        currentPage = max + currentPage;
      }
      // 已经切换至最后一页
      // 刚刚有更新新的章节
      if (currentPage >= max) {
        this.changeChapter(1);
        return;
      }

      const {
        padding,
        backgroundColor,
        color,
        boxShadow,
        maxWidth,
      } = this.getSetting();
      const chapterCount = this.book.chapterCount;
      const style = `position:absolute;
        left:0;
        top:0;
        right:0;
        bottom:0;
        overflow:hidden;
        background-color:${backgroundColor};
        padding:${titleHeight}px ${padding}px 0 ${padding}px;
        box-shadow:${boxShadow};
      `;
      const headerStyle = `position:absolute;
        left:${padding}px;
        line-height:${titleHeight}px;
        top:0;
        margin:0;
        padding:0;
        color:${color};
        font-weight:400;
      `;
      const footerStyle = `position:absolute;
        line-height:${footerHeight}px;
        bottom:0;
        color:${color};
        right: ${padding}px;
        font-weight:400;
      `;
      const percent = _.ceil(100 * chapterNo / chapterCount, 2);
      const htmls = _.map(result, (item, index) => {
        const header = `<h5 class="font12" style="${headerStyle}">${title}</h5>`;
        const footer = `<footer class="font12" style="${footerStyle}">${percent}%</footer>`;
        return `<div 
          style="${style};z-index:${max - index}"
        >${header}${item.html}${footer}</div>`;
      });
      const transform = `translate3d(${-maxWidth}px, 0px, 0px)`;
      const loadingHtml = `
        <div style="${style};z-index:${max + 1};transform:${transform}">
        </div>
      `;
      dom.style.backgroundColor = backgroundColor;
      dom.innerHTML = loadingHtml + htmls.join('');
      _.forEach(dom.children, (item, index) => {
        if (index <= currentPage) {
          item.style.transform = transform;
        }
      });
      this.currentChapter = {
        maxPage: max,
        page: currentPage,
      };
    },
    // 开始阅读
    async read(chapterNo, index = 0) {
      const {no} = this.$route.params;
      const close = this.$loading();
      this.showReload = false;
      try {
        const startedAt = Date.now();
        const data = await this.bookChapterDetail({
          no,
          chapterNo,
        });
        if (this.mode !== 2) {
          this.mode = 2;
          await this.$next();
          this.initPenEvent();
        }
        await waitFor(300, startedAt);
        this.currentReadInfo = {
          chapterNo,
          title: data.title,
          page: index,
        };
        this.userSaveReadInfo({
          no,
          data: this.currentReadInfo,
        });
        this.showChapter(data.content, index);
      } catch (err) {
        this.showReload = true;
        // 超时的出错不提示
        if (err.code !== 'ECONNABORTED') {
          this.$toast(err);
        }
      } finally {
        close();
      }
    },
    // 切换章节
    changeChapter(offset, index) {
      const {currentReadInfo, book} = this;
      let chapterNo = _.get(currentReadInfo, 'chapterNo', 0);
      chapterNo += offset;
      if (chapterNo < 0) {
        this.$toast('已至第一页');
        return;
      }
      if (chapterNo >= book.chapterCount) {
        this.$toast('已至最后一页');
        return;
      }
      this.read(chapterNo, index);
    },
    goOnReading() {
      const {currentReadInfo} = this;
      if (!currentReadInfo) {
        this.changeChapter(0, 0);
        return;
      }
      const {page} = currentReadInfo;
      this.changeChapter(0, page);
    },
    // 初始化事件
    initPenEvent() {
      const {hammer, $route, $refs} = this;
      if (hammer) {
        hammer.destroy();
      }
      const {maxWidth} = this.getSetting();
      const threshold = 10;
      const dom = $refs.chapterContent;
      this.hammer = new Hammer(dom, {
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold,
      });
      let moveType = '';
      const transition = '0.4s transform';
      const {no} = $route.params;
      const changePage = (item, currentPage, transX) => {
        item.style.transition = transition;
        item.style.transform = `translate3d(${transX}px, 0px, 0px)`;
        const {currentChapter, currentReadInfo} = this;
        currentChapter.page = currentPage;
        currentReadInfo.page = currentPage;
        this.userSaveReadInfo({
          no,
          data: currentReadInfo,
        }).catch(err => {
          console.error(`save user read info fail, ${err.message}`);
        });
        if (currentPage < 0) {
          if (currentReadInfo.chapterNo === 0) {
            this.$toast('已至第一页');
          } else {
            // 切换至上一章的时候，需要显示最后一页
            this.changeChapter(-1, -1);
          }
        } else if (currentPage >= currentChapter.maxPage) {
          this.changeChapter(1);
        }
      };
      this.hammer.on('pan panend panstart tap', e => {
        // 如果没有显示章节，所有的事件处理都显示功能菜单
        if (!this.currentChapter) {
          this.isShowingSetting = true;
          return;
        }
        const {type, deltaX, center} = e;
        let currentPage = this.currentChapter.page;
        const children = dom.children;
        const {isShowingSetting} = this;
        if (type === 'tap') {
          // 如果已显示设置功能，tap则为取消
          if (isShowingSetting) {
            this.isShowingSetting = false;
            return;
          }
          const x = center.x;
          // 上一页
          if (x < 0.35 * maxWidth) {
            changePage(children[currentPage], currentPage - 1, 0);
            return;
          }
          // 下一页
          if (x > 0.7 * maxWidth) {
            changePage(children[currentPage + 1], currentPage + 1, -maxWidth);
            return;
          }
          this.isShowingSetting = !isShowingSetting;
          return;
        }
        // 如果已显示设置功能，不可切换页
        if (isShowingSetting) {
          return;
        }
        let index = 0;
        let offset = deltaX;
        if (type === 'panstart') {
          if (deltaX > 0) {
            moveType = 'right';
          } else {
            moveType = 'left';
          }
        }
        if (moveType === 'right') {
          index -= 1;
          offset -= maxWidth;
        }
        const item = children[index + currentPage + 1];
        if (!item) {
          return;
        }
        switch (type) {
          case 'panstart':
            item.style.transition = '';
            break;
          case 'panend': {
            // 如果移动小于30px，则认为无效操作
            const avalidMoving = Math.abs(deltaX) > 30;
            let transX = 0;
            if (moveType === 'right') {
              if (avalidMoving) {
                currentPage -= 1;
              } else {
                transX = -maxWidth;
              }
            } else if (avalidMoving) {
              transX = -maxWidth;
              currentPage += 1;
            }
            changePage(item, currentPage, transX);
            break;
          }
          default:
            item.style.transform = `translate3d(${offset +
              threshold}px, 0px, 0px)`;
            break;
        }
      });
    },
    // 显示章节列表
    async showChapters(index) {
      if (index === -1) {
        this.chaptersInfo.current = -1;
        this.chaptersInfo.subItems = null;
        return;
      }
      const {book, $route} = this;
      const limit = chapterGroupLimit;
      const {no} = $route.params;
      const max = book.latestChapter.no + 1;
      if (!this.chaptersInfo) {
        const count = Math.ceil(max / limit);
        const titles = [];
        for (let i = 0; i < count; i++) {
          const start = i * limit + 1;
          const end = Math.min((i + 1) * limit, max);
          titles.push(`第${start}-${end}章`);
        }
        this.chaptersInfo = {
          count,
          current: 0,
          items: [],
          subItems: null,
          titles,
        };
      }
      const {chaptersInfo} = this;
      const skip = index * limit;
      chaptersInfo.subItems = null;
      const close = this.$loading();
      try {
        if (!chaptersInfo.items[skip]) {
          const data = await this.bookChapterList({
            no,
            fields: 'title no',
            limit,
            skip,
          });
          _.forEach(data, (item, i) => {
            chaptersInfo.items[skip + i] = item;
          });
        }
      } catch (err) {
        this.$toast(err);
      } finally {
        close();
        chaptersInfo.current = index;
        chaptersInfo.subItems = chaptersInfo.items.slice(skip, skip + limit);
      }
    },
    changeChapterGroup(index) {
      const {chaptersInfo} = this;
      if (chaptersInfo.current === index) {
        this.showChapters(-1);
      } else {
        this.showChapters(index);
      }
    },
  },
  watch: {
    async mode(v, prevMode) {
      const {steps, chaptersInfo, backTrigger, currentReadInfo} = this;
      // 如果是返回导致的，不记录
      // 第一次也不记录
      if (!backTrigger && prevMode !== -1) {
        steps.push(prevMode);
      }
      this.backTrigger = false;
      if (v === 1) {
        if (chaptersInfo) {
          return;
        }
        const chapterNo = _.get(currentReadInfo, 'chapterNo', 0);
        this.showChapters(_.floor(chapterNo / chapterGroupLimit));
      }
    },
  },
  async beforeMount() {
    const close = this.$loading();
    const {no} = this.$route.params;
    this.steps = [];
    try {
      const data = await this.bookGetDetail(no);
      const {name, latestChapter} = data;
      this.title = name;
      if (latestChapter) {
        const date = getDate(latestChapter.updatedAt);
        this.updatedAt = date.substring(5, 16);
      }
      this.book = data;
      this.currentReadInfo = await this.userGetReadInfo(no);
      this.mode = 0;
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
};
