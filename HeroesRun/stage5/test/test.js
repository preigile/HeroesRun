import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {
    page = this.getPage(pagePath);

    tests = [
        this.page.execute(async () => {
            const mapContainer = document.querySelector('.map-container');

            return mapContainer ?
              correct() :
              wrong('The page should have a map container')
        }),

        this.page.execute(async () => {
            const mapTitle = document.querySelector('.map-container h2');
            const mapTitleContent = mapTitle.textContent;

            return mapTitleContent === 'See you at the Big Ben!' ?
              correct() :
              wrong('The map should have title with text See you at the Big Ben!')
        }),

        this.page.execute(async () => {
            const embeddedMap = document.querySelector('.map-container iframe');

            return embeddedMap.src.includes('google.com/maps/embed') ?
              correct() :
              wrong('The last iframe should have an embedded map')
        }),
    ]
}

it('Test stage', async () => {
      await new Test().runTests()
  }
).timeout(30000);
