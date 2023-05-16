import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

class Test extends StageTest {
    page = this.getPage(pagePath);

    tests = [
        this.page.execute(async () => {
            const distanceImages = document.querySelectorAll('.distance img');
            let saturateImages = 0;

            distanceImages.forEach((image) => {
                const computedStyle = getComputedStyle(image);
                if (computedStyle.filter === 'saturate(1)') {
                    saturateImages++;
                }
            });

            return saturateImages === 5 ?
              correct() :
              wrong('Every image should have saturate filter applied by default');
        }),

        this.node.execute(async () => {
            const distanceImages = await this.page.findAllBySelector('.distance img');
            let saturateImages = 0;

            for (const image of distanceImages) {
                await image.hover();
                const computedStyle = await image.getComputedStyles();
                if (computedStyle.filter === 'saturate(2)') {
                    saturateImages++;
                }
            }

            return saturateImages === 5 ?
              correct() :
              wrong('Every image should be super-saturates on hover');
        }),
    ]
}

it('Test stage', async () => {
      await new Test().runTests()
  }
).timeout(30000);
