# State

### When should we use hooks vs. Contexts?

Some of our hooks we have made into contexts. Contexts are for data that is global to the application, or that is used in many places. Hooks are for data that is local to a component, or that is used in only one place.

For example, the `useUser` hook is used in many places, so we made it into a context so that we can access the user data from anywhere in the application. It won't need to re-fetch the user data every time we use it.

`useUser` (`UserContext`) and `useCompany` (`CompanyContext`) are global contexts. They are used in the `_app.ts` file, which is the root of the application. This means that the user data and basic company data is available in every page of the application.

The next layer down in our application is the `Layout` component. This is called in every page except for the login/signup pages. The login/signup pages also have a layout in the `LoginSignoutLayout` component.
