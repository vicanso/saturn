import {mapActions} from 'vuex';
import _ from 'lodash';
import Hammer from 'hammerjs';

import ImageView from '../../components/ImageView';
import Loading from '../../components/Loading';
import {getDate, getDefaultColors, waitFor} from '../../helpers/util';
import FontMetrics from 'web-font-metrics';

export default {
  components: {
    ImageView,
    Loading,
  },
  data() {
    return {
      mode: -1,
      book: null,
      title: '...',
      updatedAt: '',
      chapters: null,
      content: '',
      isShowingSetting: false,
      currentReadInfo: null,
      showReload: false,
    };
  },
  methods: {
    ...mapActions([
      'bookGetDetail',
      'bookChapterList',
      'bookChapterDetail',
      'bookGetReadInfo',
      'bookSaveReadInfo',
    ]),
    back() {
      const {mode} = this;
      if (mode !== 0) {
        this.mode = 0;
        return;
      }
      this.$router.back();
    },
    getSetting() {
      const dom = this.$refs.chapterContent;
      const width = dom.clientWidth;
      return _.extend(
        {
          width,
          height: dom.clientHeight,
          padding: 20,
          fontSize: 20,
          lineHeight: 32,
          maxWidth: width + 10,
        },
        getDefaultColors('yellow'),
      );
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
          height: height - 2 * padding,
          lineHeight,
          fontSize,
          format: 'html',
          color,
        });
      }
      return this.fontMetrics;
    },
    showChapter(content, showLastPage) {
      const {title, chapterNo} = this.currentReadInfo;
      const dom = this.$refs.chapterContent;
      const fontMetrics = this.getFontMetrics();
      const result = fontMetrics.getFillTextList(content);
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
        background-color:${backgroundColor};
        padding:${padding}px ${padding}px 0 ${padding}px;
        box-shadow:${boxShadow};
      `;
      const headerStyle = `position:absolute;
        left:${padding}px;
        line-height:${padding}px;
        top:0;
        margin:0;
        padding:0;
        color:${color};
        font-weight:400;
      `;
      const footerStyle = `position:absolute;
        line-height:${padding}px;
        bottom:0;
        color:${color};
        right: ${padding}px;
        font-weight:400;
      `;
      const max = result.length;
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
      if (showLastPage) {
        _.forEach(dom.children, (item, index) => {
          if (index !== max) {
            item.style.transform = transform;
          }
        });
        // 设置为显示最后一页
        this.currentChapter = {
          maxPage: max,
          page: max - 1,
        };
      } else {
        // 设置为显示每一页
        this.currentChapter = {
          maxPage: max,
          page: 0,
        };
      }
    },
    async read(chapterNo, showLastPage) {
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
        };
        this.bookSaveReadInfo({
          no,
          data: this.currentReadInfo,
        });
        this.showChapter(data.content, showLastPage);
      } catch (err) {
        this.showReload = true;
        this.$toast(err);
      } finally {
        close();
      }
    },
    goOnReading() {
      const chapterNo = _.get(this.currentReadInfo, 'chapterNo', 0);
      this.read(chapterNo);
    },
    loadNextChapter() {
      const chapterNo = _.get(this.currentReadInfo, 'chapterNo', 0);
      this.read(chapterNo + 1);
    },
    initPenEvent() {
      if (this.hammer) {
        this.hammer.destroy();
      }
      const {maxWidth} = this.getSetting();
      const threshold = 10;
      const dom = this.$refs.chapterContent;
      const hammer = new Hammer(dom, {
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold,
      });
      let moveType = '';
      const transition = '0.4s transform';
      hammer.on('pan panend panstart tap', e => {
        const {type, deltaX} = e;
        let currentPage = this.currentChapter.page;
        const children = dom.children;
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

            item.style.transition = transition;
            item.style.transform = `translate3d(${transX}px, 0px, 0px)`;
            const {currentChapter, currentReadInfo} = this;
            currentChapter.page = currentPage;
            if (currentPage <= 0) {
              if (currentReadInfo.chapterNo === 0) {
                this.$toast('已至第一页');
              } else {
                // 切换至上一章的时候，需要显示最后一页
                this.read(currentReadInfo.chapterNo - 1, true);
              }
            } else if (currentPage >= currentChapter.maxPage) {
              this.read(currentReadInfo.chapterNo + 1);
            }
            break;
          }
          default:
            item.style.transform = `translate3d(${offset +
              threshold}px, 0px, 0px)`;
            break;
        }
      });
      this.hammer = hammer;
    },
  },
  watch: {
    async mode(v) {
      if (v === 1) {
        if (this.chapters) {
          return;
        }
        const {no} = this.$route.params;
        const max = this.book.latestChapter.no + 1;
        const limit = 100;
        const count = Math.ceil(max / limit);
        const fns = [];
        for (let index = 0; index < count; index++) {
          fns.push(
            this.bookChapterList({
              no,
              fields: 'title',
              limit,
              skip: index * limit,
            }),
          );
        }
        try {
          const data = await Promise.all(fns);
          this.chapters = _.flatten(data);
        } catch (err) {
          this.$toast(err);
        }
      }
    },
  },
  async beforeMount() {
    const close = this.$loading();
    const {no} = this.$route.params;
    try {
      const data = await this.bookGetDetail(no);
      const {name, latestChapter} = data;
      this.title = name;
      if (latestChapter) {
        const date = getDate(latestChapter.updatedAt);
        this.updatedAt = date.substring(5, 16);
      }
      this.book = data;
      this.currentReadInfo = await this.bookGetReadInfo(no);
      this.mode = 0;
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
};
