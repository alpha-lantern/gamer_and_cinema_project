import { getParam } from "./utils.mjs";

export default class Filters {
    constructor() {
    }

    getSearch() {
        try {
            const title = getParam("search") || null;
            return title;
        } catch (error) {
            console.error("Something went wrong with the search", error);
            throw error;
        }
    }

    getParams() {
        try {
            // const title = getParam("search") || null;
            const year = getParam("year") || null;
            const genre = getParam("genre") || null;
            const platforms = getParam("platforms") || null;
            // console.log(platforms);
            let parsedPlatforms = platforms;
            if (platforms !== null) {
                parsedPlatforms = platforms.split(" ").join(",");
                // console.log(`Parsed:${parsedPlatforms}`);
            }
            return {"year": year, "genre": genre, "platforms": parsedPlatforms};
        } catch (error) {
            console.error("Something went wrong retrieving the parameter", error);
            throw error;
        }
    }
}