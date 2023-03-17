import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {
  page = this.getPage(pagePath)

  tests = [
    this.page.execute(() => {
      const iframes = document.getElementsByTagName('iframe');

      if (iframes.length === 0) {
        return wrong(`Cannot find iframes`);
      } else if (iframes.length === 2) {
        return correct();
      }

      return wrong('Your page must contain two iframes')
    }),

    this.page.execute(() => {
      const iframe = document.getElementsByTagName('iframe')[0];

      return iframe.src.startsWith('https://www.youtube.com/embed/') ?
        correct() :
        wrong('The first iframe must contain a link to youtube')
    }),

    this.page.execute(() => {
      const iframe = document.getElementsByTagName('iframe')[1];

      return iframe.src.startsWith('https://www.meteoblue.com/en/weather/widget/daily/london_united-kingdom_') ?
        correct() :
        wrong('Please make sure that the weather widget is displayed for London')
    }),

    this.page.execute(() => {
      const iframe = document.getElementsByTagName('iframe')[1];

      return iframe.src.includes('days=7') ?
        correct() :
        wrong('Please make sure that the weather widget is displayed for 7 days')
    }),
  ]
}

it("Test stage", async () => {
    await new Test().runTests()
  }
).timeout(30000);
