# Microservices with Node.JS
  A Speakers listing App based on Microservices. It consists of two major services for Speakers and Feedback. 
  I've completed learning this course on LinkedIn Learning.

## Project Setup
   - First run the service-registry project using `npm start`
   - Then run speakers-service project using `npm start`
   - Then run feedback-service project using `npm start`
   - Then run conference-app project using `npm start`

Then run the project in the browser on `http://localhost: 3080/` (initially configured).

## Description
`conference-app` is the main app serving the whole project in the browser. It request the need service (eg: `speakers-service`) to fetch/write the data. Services first need to register themselves in `service-registry`, else it will crash the project because you are fetching a service which is not available in the `service-registry`.
