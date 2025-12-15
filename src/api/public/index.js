// src/api/public/index.js

// Hero API
export { getHeroSlides, getHeroSlideById, default as heroApi } from './heroApi';

// Stats API
export { getStats, getStatById, default as statsApi } from './statsApi';

// About API (Home Page)
export {
    getAboutCards,
    getAboutCardById,
    getFirstAboutCard,
    default as aboutApi
} from './aboutApi';

// // Video API
// export { getVideos, getVideoById, default as videoApi } from './videoApi';

// // About Us Page API
// export {
//     getAboutUsHero,
//     getAboutUsAbout,
//     getAboutUsAreas,
//     getAboutUsAreaById,
//     getAboutUsPageData,
//     default as aboutUsApi,
// } from './aboutUsApi';

// // Vision & Mission API
// export {
//     getVisionMissionHero,
//     getVisionMissionItems,
//     getVisionMissionByType,
//     getVisionMissionItemById,
//     getVisionMissionPageData,
//     default as visionMissionApi,
// } from './visionMissionApi';

// // Our Work API
// export {
//     getOurWorkSummary,
//     getOurWorkList,
//     getOurWorkById,
//     default as ourWorkApi,
// } from './ourWorkApi';

// // Inquiries/Contact API
// export { submitInquiry, default as inquiriesApi } from './inquiriesApi';

// // Settings API
// export { getSettings, default as settingsApi } from './settingsApi';