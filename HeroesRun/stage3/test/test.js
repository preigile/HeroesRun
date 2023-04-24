import path from 'path';

const pagePath = path.join(import.meta.url, '../../src/index.html');
import {StageTest, correct, wrong} from 'hs-test-web';

class Test extends StageTest {
    page = this.getPage(pagePath);

    tests = [
        this.page.execute(async () => {
            const distanceContainer = document.querySelector('.distance-container h2');
            const distanceContainerTitle = distanceContainer.textContent;

            return distanceContainerTitle === 'Running Distances' ?
              correct() :
              wrong('This component should have a title "Running Distances"')
        }),

        this.page.execute(() => {
            const distanceContainer = document.getElementsByClassName('distance-container')[0];
            const distances = distanceContainer.getElementsByClassName('distance')

            return distances.length === 5 ?
              correct() :
              wrong(`Please add all 5 distance`)
        }),

        this.page.execute(() => {
            const distanceContainer = document.getElementsByClassName('distance-container')[0];
            const distances = distanceContainer.getElementsByClassName('distance');
            let count = 0;

            for (const distance of distances) {
                if (distance.querySelector('h2').textContent.length > 0
                  && distance.querySelector('img').getAttribute('src')
                  && distance.querySelector('p').textContent.length > 0
                ) {
                    ++count
                }
            }

            return count === 5 ?
              correct() :
              wrong('Be sure each distance have a title, image, and description')
        }),
    ]
}

it('Test stage', async () => {
      await new Test().runTests()
  }
).timeout(30000);
