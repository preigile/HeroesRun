import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {
  page = this.getPage(pagePath)

  tests = [
    // Test 1 - check iframes count
    this.node.execute(async () => {
      const iframes = await this.page.findAllBySelector('iframe');

      if (iframes.length === 0) {
        return wrong(`Cannot find iframes`);
      } else if (iframes.length === 2) {
        return correct();
      }

      return wrong('Your page must contain two iframes');
    }),

    // Test 2 - check first iframe contains youtube
    this.page.execute(() => {
      const iframes = document.getElementsByTagName('iframe');

      return iframes && iframes[0]?.src.startsWith('https://www.youtube.com/embed/') ?
        correct() :
        wrong('The first iframe must contain a link to youtube');
    }),

    // Test 3 - check second iframe contains meteoblue
    this.page.execute(() => {
      const iframes = document.getElementsByTagName('iframe');

      return iframes && iframes[1]?.src.startsWith('https://www.meteoblue.com/en/weather/widget/daily/london_united-kingdom_') ?
        correct() :
        wrong('Please make sure that the weather widget is displayed for London');
    }),

    // Test 4 - check second iframe show weather for 7 days
    this.page.execute(() => {
      const iframes = document.getElementsByTagName('iframe');

      return iframes && iframes[1]?.src.includes('days=7') ?
        correct() :
        wrong('Please make sure that the weather widget is displayed for 7 days');
    }),

    // Test 5 - check .iframe-container is existing
    this.page.execute(() => {
      const youtubeIframe = document.querySelector('.iframe-container iframe[src*="youtube"]');
      const weatherIframe = document.querySelector('.iframe-container iframe[src*="meteoblue"]');
      const youtubeContainer = youtubeIframe?.parentElement;
      const weatherContainer = weatherIframe?.parentElement;

      return youtubeContainer && youtubeContainer.classList.contains('iframe-container')
      && weatherContainer && weatherContainer.classList.contains('iframe-container') ?
        correct() :
        wrong('Each iframe should be in a div with the `.iframe-container` class');
    }),
  ]
}

it("Test stage", async () => {
    await new Test().runTests()
  }
).timeout(30000);
