# Alliance Selector
This is a Create React App. It is hosted using firebase hosting and uses github actions for deployment. There are two separate projects, a beta and a prod.

## Local development
- Use / Install node 18.10.0 
	Suggest using nvm or n
- Install yarn 
	`npm install --global yarn`
- Clone repo
	`gh repo clone wmaltmann/alliance-selector`
- Install packages
	`yarn install`
- Add packages
	`yarn add <packageName>`
	`yarn add <packageName> --dev`
- Build & run
	`npm run start`
	Chrome will open http://localhost:3000
	
## Deployments
Build: 
	Create branch
	Edit .env to REACT_APP_STAGE="local" and commit change
	npm run build
	
Deploy alliance-selector-beta:
	Edit .env to REACT_APP_STAGE="beta" and commit change
	Merge changes into beta branch 

Deploy alliance-selector: 
	Edit .env to REACT_APP_STAGE="prod" and commit change
	Merge changes into prod branch

As of 5/14/24 Beta URL is https://alliances-beta.web.app/
As of 5/14/24 Prod URL is https://alliances.web.app/