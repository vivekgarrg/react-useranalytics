# React User Analytics Package - README

## Overview

Welcome to the documentation for the **react-useranalytics** package! This package is designed to help you integrate user analytics seamlessly into your React applications. With **react-useranalytics**, you can gain insights into how users interact with your application, track events, and make informed decisions to enhance user experience.

## Installation

You can easily install the package using npm:

```bash
npm install react-useranalytics --save
```

or with Yarn:

```bash
yarn add react-useranalytics
```

## Usage

1. **Import the package:**

   ```jsx
   import userAnalytics from "react-useranalytics";
   ```

2. **Add your API url to get the page analytics [ method: "POST", "Content-Type": "application/json",]:**

   ```jsx
   userAnalytics.apiKey = "YOUR API URL";
   ```


## API Reference

### `UserAnalyticsProvider` Props

- `apiKey` string: Your user analytics API key.
- `setUserId` (string): Your user id to track page views based on user.
- `set` ({page : string, title:string, subTitle?:string}): Page properties.



## Examples

- Tracking page views:
 ```jsx
   import userAnalytics from "react-useranalytics";

   const MyComponent = () => {
     const [userIdFlag, setUserIdFlag] = useState(true);

    userAnalytics.apiKey = "YOUR API URL";
     useEffect(() => {
        if (userId && userIdFlag) {
            userAnalytics.setUserId(userId);
            setUserIdFlag(false);
        }
        if (userId) {
            userAnalytics.set({
                page: "page_url", //**Mandatory**
                title: "page_title", //**Mandatory**
                subTitle: "page_subtitle",//**Optional**
            });
        }
        return () => {
            userAnalytics.logTime();
        };
    }, [ userId, userIdFlag]);

     return (
        <App/>
     );
   };
   ```


## Support and Issues

If you encounter any issues or have questions about using this package, please feel free to [open an issue on GitHub](https://github.com/your-repo/react-useranalytics/issues).

## License

This package is released under the [MIT License](https://opensource.org/licenses/MIT).

---

We hope that the **react-useranalytics** package serves your needs for integrating user analytics into your React application. If you have any feedback or suggestions, we'd love to hear from you!