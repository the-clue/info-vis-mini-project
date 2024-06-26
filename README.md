# info-vis-mini-project
 
## Mosquitoes Flying Around
This project visualizes the movement and interaction of mosquitoes based on multivariate data. The project uses a datafile with 10 data-cases, each containing 6 variables. Each pair of variables (first and second, third and fourth, fifth and sixth) represent a coordinate of a mosquito. The mosquitoes move to different positions on click (cycling between the coordinates), and users can click on individual mosquitoes to "squash" them, which will turn them red and make them unable to move.

### Features
- Dynamic mosquito movement on click
- Squash mosquitoes by clicking on them
- Tooltip to show mosquito coordinates (not shown for squashed mosquitoes)

### File Structure
- index.html: The main HTML file.
- styles/style.css: The CSS file for styling.
- scripts/script.js: The JavaScript file containing the logic. This file also contains the paths for the data and the SVG to use if you need to change them.
- data: The folder containing the JSON files with mosquito coordinates. It contains 4 examples you can use as data-cases.
- images/mosquito.svg: The SVG file for the mosquito silhouette.

### Demo
[See the live demo here.](https://the-clue.github.io/info-vis-mini-project)