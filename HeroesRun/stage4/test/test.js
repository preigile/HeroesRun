import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {
    page = this.getPage(pagePath);

    tests = [
        this.page.execute(async () => {
            const iframeContainer = document.querySelector('.iframe-container');

            return iframeContainer.querySelector('.video-overlay') ?
              correct() :
              wrong('Make sure you add a block with the video-overlay class inside the first iframe container');
        }),

        this.page.execute(async () => {
            const videoOverlay = document.querySelector('.video-overlay');

            return videoOverlay.querySelector('h1') ?
              correct() :
              wrong('Make sure you add a header to the first iframe-container');
        }),

        this.page.execute(async () => {
            const videoOverlay = document.querySelector('.video-overlay');

            return videoOverlay.querySelector('button') ?
              correct() :
              wrong('Make sure you add a button to the first iframe-container');
        }),

        this.page.execute(async () => {
            const body = document.querySelector('body');
            const fontFamily = window.getComputedStyle(body).getPropertyValue('font-family');
            const fonts = fontFamily.includes('Roboto')
              && fontFamily.includes('Helvetica Neue')
              && fontFamily.includes('Arial')
              && fontFamily.includes('sans-serif');

            return fonts ?
              correct() :
              wrong('Make sure that the body tag is set to all fonts: Roboto, Helvetica Neue, Arial, sans-serif');
        }),

        this.page.execute(async () => {
            const distanceContainer = document.querySelector('.distance-container');
            let styles = window.getComputedStyle(distanceContainer);

            return distanceContainer && styles.maxWidth === '1000px' ?
              correct() :
              wrong('Make sure that the list of distances has a maximum width of 1000px');
        }),

        this.page.execute(async () => {
            const distanceContainer = document.querySelector('.distance-container');
            const distanceHeader = distanceContainer.querySelector('h2');
            let styles = window.getComputedStyle(distanceHeader);

            return distanceHeader && styles.fontSize === '32px' ?
              correct() :
              wrong('Make sure that the font size of the distance list header is 32px');
        }),
    ]
}

it('Test stage', async () => {
      await new Test().runTests()
  }
).timeout(30000);
