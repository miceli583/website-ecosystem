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
  "wildflower-landing": () => import("./wildflower-landing").then((m) => ({ default: m.WildflowerLanding })),
  "wildflower-assets": () => import("./wildflower-assets").then((m) => ({ default: m.WildflowerAssets })),
};
