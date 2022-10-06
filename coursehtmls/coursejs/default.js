let pageCourse = window.opener.getCourseOpened();

const name = document.querySelector("#name");
const codeCredits = document.querySelector("#code-credits");
const catalogRef = document.querySelector("#coursecatalog");
function setup() {
  if(pageCourse === undefined)
    return;
  name.innerHTML = pageCourse.name;
  codeCredits.innerHTML = `${pageCourse.code} - ${pageCourse.credits} credit hours`;
  catalogRef.setAttribute("href", `https://catalog.colorado.edu/search/?search=${pageCourse.code}`);
  //tryRetrieveInfo(`https://catalog.colorado.edu/search/?search=${pageCourse.code}`);
}
/* attempt at retrieving course catalog info
function tryRetrieveInfo(path) {
  let http = new XMLHttpRequest();
  http.open('HEAD', path, false);
  http.send();
  if(http.status != 404) {
    http.open("GET", path, true);
    http.onload = () => {
      const doc = new DOMParser().parseFromString(http.responseText, 'text/html');
      document.querySelector('.retrievedinfo').innerHTML = doc.querySelector('.courseblock').innerHTML;
    }
    http.send();
  }
}
*/
