import { type ComponentType } from "react";

export const DEMO_REGISTRY: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  "tapchw-website": () => import("./tapchw-website").then((m) => ({ default: m.TAPCHWWebsiteDemo })),
  "chw360-frontend": () => import("./chw360-frontend").then((m) => ({ default: m.CHW360FrontendDemo })),
  "chw360-admin": () => import("./chw360-admin").then((m) => ({ default: m.CHW360AdminDemo })),
  "chw360-mockup": () => import("./chw360-mockup").then((m) => ({ default: m.CHW360MockupDemo })),
  "chw360-website-hub": () => import("./chw360-website-hub").then((m) => ({ default: m.CHW360WebsiteHub })),
  "chw360-mockup-hub": () => import("./chw360-mockup-hub").then((m) => ({ default: m.CHW360MockupHub })),
  "slides-hub": () => import("./slides-hub").then((m) => ({ default: m.SlidesHub })),
  "slides-inputs": () => import("./slides-inputs").then((m) => ({ default: m.SlidesInputsDemo })),
  "slides-talking-tracks": () => import("./slides-talking-tracks").then((m) => ({ default: m.SlidesTalkingTracksDemo })),
  "slides-presentation": () => import("./slides-presentation").then((m) => ({ default: m.SlidesPresentationDemo })),
  "slides-gamma": () => import("./slides-gamma").then((m) => ({ default: m.SlidesGammaDemo })),
  "mockup-assets": () => import("./mockup-assets").then((m) => ({ default: m.MockupAssetsDemo })),
  "cargowatch-hub": () => import("./cargowatch-hub").then((m) => ({ default: m.CargoWatchHub })),
  "cargowatch-landing": () => import("./cargowatch-landing").then((m) => ({ default: m.CargoWatchLanding })),
  "cargowatch-about": () => import("./cargowatch-about").then((m) => ({ default: m.CargoWatchAbout })),
  "cargowatch-resources": () => import("./cargowatch-resources").then((m) => ({ default: m.CargoWatchResources })),
  "cargowatch-dashboard": () => import("./cargowatch-dashboard").then((m) => ({ default: m.CargoWatchDashboard })),
  "cargowatch-alerts": () => import("./cargowatch-alerts").then((m) => ({ default: m.CargoWatchAlerts })),
  "cargowatch-map": () => import("./cargowatch-map").then((m) => ({ default: m.CargoWatchMap })),
};
