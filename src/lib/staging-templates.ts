/**
 * Staging Templates — Reusable visual configurations for demo hub cards.
 * Template 1: "blackGold" (Miracle Mind default)
 */

export type TemplateId = "blackGold";

export interface StagingTemplate {
  id: TemplateId;
  name: string;
  card: {
    borderColor: string;
    bg: string;
    hoverBg: string;
  };
  iconContainer: {
    background: string;
    border: string;
    iconColor: string;
  };
  title: {
    hoverColor: string;
  };
  badge: {
    backgroundColor: string;
    color: string;
  };
  orb: {
    backgroundColor: string;
  };
}

const blackGold: StagingTemplate = {
  id: "blackGold",
  name: "Miracle Mind Gold",
  card: {
    borderColor: "rgba(212, 175, 55, 0.2)",
    bg: "bg-white/5",
    hoverBg: "hover:bg-white/10",
  },
  iconContainer: {
    background:
      "linear-gradient(135deg, rgba(246, 230, 193, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)",
    border: "1px solid rgba(212, 175, 55, 0.2)",
    iconColor: "#D4AF37",
  },
  title: {
    hoverColor: "#D4AF37",
  },
  badge: {
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    color: "#D4AF37",
  },
  orb: {
    backgroundColor: "rgba(212, 175, 55, 0.03)",
  },
};

export const STAGING_TEMPLATES: Record<TemplateId, StagingTemplate> = {
  blackGold,
};

export const DEFAULT_TEMPLATE: TemplateId = "blackGold";

export function getTemplate(id: TemplateId = DEFAULT_TEMPLATE): StagingTemplate {
  return STAGING_TEMPLATES[id];
}
