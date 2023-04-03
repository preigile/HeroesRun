import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {
    page = this.getPage(pagePath);

    tests = [
        this.page.execute(() => {
            const iframeContainer = document.getElementsByClassName('iframe-container');
            const youtubeIframeContainerStyle = window.getComputedStyle(iframeContainer[0]);
            const weatherIframeContainerStyle = window.getComputedStyle(iframeContainer[1]);

            return youtubeIframeContainerStyle.margin === '0px' && weatherIframeContainerStyle.margin === '0px' ?
              correct() :
              wrong('Check that the iframes are displayed one after the other, with no space between them')
        }),

        this.page.execute(async () => {
            await this.page.setViewport({width: 1200, height: 740});
            const iframeContainer = document.getElementsByClassName('iframe-container');
            const youtubeIframeContainerStyle = window.getComputedStyle(iframeContainer[0]);
            const weatherIframeContainerStyle = window.getComputedStyle(iframeContainer[1]);

            return youtubeIframeContainerStyle.width === '1200px' && weatherIframeContainerStyle.width === '1200px' ?
              correct() :
              wrong('Width of both iframes should be set to 100% of the screen width')
        }),

        this.page.execute(async () => {
            await this.page.setViewport({width: 1200, height: 1000});
            const youtubeIframe = document.getElementsByTagName('iframe')[1];
            const youtubeIframeStyle = window.getComputedStyle(youtubeIframe);

            return youtubeIframeStyle.height === '800px' ?
              correct() :
              wrong('Be sure the height of the YouTube iframe is 80% of screen height')
        }),

        this.page.execute(async () => {
            const youtubeIframe = document.getElementsByTagName('iframe')[0];

            return !youtubeIframe.src.includes('controls=1') ?
              correct() :
              wrong('Hide the controls for YouTube iframe')
        }),
    ]
}

it("Test stage", async () => {
      await new Test().runTests()
  }
).timeout(30000);
