import {mapActions} from 'vuex';
import _ from 'lodash';
import Hammer from 'hammerjs';

import ImageView from '../../components/ImageView';
import {getDate, getDefaultColors} from '../../helpers/util';
import FontMetrics from 'web-font-metrics';

export default {
  components: {
    ImageView,
  },
  data() {
    return {
      mode: 0,
      book: null,
      title: '...',
      updatedAt: '',
      chapters: null,
      content: '',
      isShowingSetting: false,
    };
  },
  methods: {
    ...mapActions(['bookGetDetail', 'bookChapterList', 'bookChapterDetail']),
    back() {
      const {mode} = this;
      if (mode !== 0) {
        this.mode = 0;
        return;
      }
      this.$router.back();
    },
    getSetting() {
      return _.extend(
        {
          padding: 20,
          fontSize: 16,
        },
        getDefaultColors('yellow'),
      );
    },
    getFontMetrics() {
      if (!this.fontMetrics) {
        const dom = this.$refs.chapterContent;
        const {padding, fontSize, color} = this.getSetting();
        this.fontMetrics = new FontMetrics({
          width: dom.clientWidth - 2 * padding,
          height: dom.clientHeight - 2 * padding,
          fontSize,
          format: 'html',
          color,
        });
      }
      return this.fontMetrics;
    },
    showChapter(content) {
      const {title, chapterNo} = this.currentReadInfo;
      const dom = this.$refs.chapterContent;
      const fontMetrics = this.getFontMetrics();
      const result = fontMetrics.getFillTextList(content);
      const {padding, backgroundColor, color, boxShadow} = this.getSetting();
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
      const maxWidth = dom.clientWidth + 10;
      const transform = `translate3d(${-maxWidth}px, 0px, 0px)`;
      const loadingHtml = `
        <div style="${style};z-index:${max + 1};transform:${transform}">
        </div>
      `;
      dom.style.backgroundColor = backgroundColor;
      dom.innerHTML = loadingHtml + htmls.join('');
      // 设置为显示每一页
      this.currentChapter = {
        maxPage: max,
        page: 0,
      };
    },
    async read(chapterNo) {
      const {no} = this.$route.params;
      const close = this.$loading();
      try {
        const data = await this.bookChapterDetail({
          no,
          chapterNo,
        });
        if (this.mode !== 2) {
          this.mode = 2;
          await this.$next();
          this.initPenEvent();
        }
        this.currentReadInfo = {
          chapterNo,
          title: data.title,
        };
        this.showChapter(data.content);
      } catch (err) {
        this.$toast(err);
      } finally {
        close();
      }
    },
    goOnReading() {
      this.read(0);
    },
    initPenEvent() {
      if (this.hammer) {
        this.hammer.destroy();
      }
      const threshold = 10;
      const dom = this.$refs.chapterContent;
      const maxWidth = dom.clientWidth + 10;
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
            // if (currentPage <= 0 && currentReadInfo.index === 0) {
            //   item.style.transform = `translate3d(${-maxWidth}px, 0px, 0px)`;
            //   this.$toast('已至第一页');
            //   return;
            // }
            item.style.transform = `translate3d(${transX}px, 0px, 0px)`;
            this.currentChapter.page = currentPage;
            if (currentPage >= this.currentChapter.maxPage) {
              this.read(this.currentReadInfo.chapterNo + 1);
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
        if (this.chapterData) {
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
        this.updatedAt = date.substring(11, 16);
      }
      this.book = data;
    } catch (err) {
      this.$toast(err);
    } finally {
      close();
    }
  },
};
