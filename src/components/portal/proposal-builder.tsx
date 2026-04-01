"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import {
  RichTextEditor,
  type RichTextEditorRef,
} from "~/components/portal/rich-text-editor";
import { nanoid } from "nanoid";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Landmark,
  GripVertical,
  Loader2,
  FileText,
} from "lucide-react";

import type { ProposalMetadataV2 } from "~/server/api/routers/proposals";

// ============================================================================
// TYPES
// ============================================================================

interface LineItem {
  name: string;
  description?: string;
  qty: number;
  unitPrice: number; // cents
}

interface ProposalOption {
  id: string;
  name: string;
  description?: string;
  lineItems: LineItem[];
  paymentType: "one-time" | "recurring";
  recurringInterval?: "month" | "year";
  enabledPaymentMethods: ("credit" | "bank")[];
  totalPrice: number;
}

interface CheckoutGroup {
  id: string;
  name: string;
  required: boolean;
  options: ProposalOption[];
}

interface ProposalBuilderProps {
  slug: string;
  editProposalId?: number; // if editing an existing proposal
  onSaved?: (id: number) => void;
}

// ============================================================================
// HELPERS
// ============================================================================

function computeTotal(lineItems: LineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

function newLineItem(): LineItem {
  return { name: "", qty: 1, unitPrice: 0 };
}

function newOption(): ProposalOption {
  return {
    id: nanoid(10),
    name: "",
    lineItems: [newLineItem()],
    paymentType: "one-time",
    enabledPaymentMethods: ["credit"],
    totalPrice: 0,
  };
}

function newGroup(): CheckoutGroup {
  return {
    id: nanoid(10),
    name: "",
    required: true,
    options: [newOption()],
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ProposalBuilder({
  slug,
  editProposalId,
  onSaved,
}: ProposalBuilderProps) {
  const utils = api.useUtils();
  const editorRef = useRef<RichTextEditorRef>(null);

  // Fetch existing proposal if editing
  const { data: existingProposal } = api.proposals.getById.useQuery(
    { proposalId: editProposalId! },
    { enabled: !!editProposalId, staleTime: 30 * 1000 }
  );

  // Fetch client info for autofill (creation only)
  const { data: clientData } = api.portal.getClientBySlug.useQuery(
    { slug },
    { enabled: !editProposalId, staleTime: 5 * 60 * 1000 }
  );

  // Fetch projects for assignment
  const { data: projects } = api.portal.getProjects.useQuery(
    { slug },
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch agreement templates
  const { data: templates } = api.proposals.listTemplates.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  // --------------------------------------------------------------------------
  // Form state
  // --------------------------------------------------------------------------

  const existingMeta =
    existingProposal?.metadata as unknown as ProposalMetadataV2 | null;

  const [title, setTitle] = useState(existingProposal?.title ?? "");
  const [description, setDescription] = useState(
    existingProposal?.description ?? ""
  );
  const [projectId, setProjectId] = useState<number | undefined>(
    existingProposal?.projectId ?? undefined
  );
  const [checkoutGroups, setCheckoutGroups] = useState<CheckoutGroup[]>(
    existingMeta?.checkoutGroups ?? [newGroup()]
  );
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<number[]>(
    existingMeta?.agreementTemplateIds ?? []
  );
  const [customTerms, setCustomTerms] = useState(
    existingMeta?.customTerms ?? ""
  );
  const [currency, setCurrency] = useState(existingMeta?.currency ?? "usd");
  const [validUntil, setValidUntil] = useState(existingMeta?.validUntil ?? "");
  const [customerName, setCustomerName] = useState(
    existingMeta?.customerInfo?.name ?? ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    existingMeta?.customerInfo?.email ?? ""
  );
  const [customerCompany, setCustomerCompany] = useState(
    existingMeta?.customerInfo?.company ?? ""
  );

  // Autofill customer info from client data (creation only)
  const [clientSynced, setClientSynced] = useState(false);
  if (!editProposalId && clientData && !clientSynced) {
    if (!customerName && clientData.name) setCustomerName(clientData.name);
    if (!customerEmail && clientData.email) setCustomerEmail(clientData.email);
    if (!customerCompany && clientData.company)
      setCustomerCompany(clientData.company);
    setClientSynced(true);
  }

  // Sync existing proposal data when it loads
  const [synced, setSynced] = useState(false);
  if (existingProposal && !synced) {
    setTitle(existingProposal.title);
    setDescription(existingProposal.description ?? "");
    setProjectId(existingProposal.projectId ?? undefined);
    if (existingMeta?.checkoutGroups) {
      setCheckoutGroups(existingMeta.checkoutGroups);
    }
    if (existingMeta?.agreementTemplateIds) {
      setSelectedTemplateIds(existingMeta.agreementTemplateIds);
    }
    if (existingMeta?.customTerms) setCustomTerms(existingMeta.customTerms);
    if (existingMeta?.currency) setCurrency(existingMeta.currency);
    if (existingMeta?.validUntil) setValidUntil(existingMeta.validUntil);
    if (existingMeta?.customerInfo) {
      setCustomerName(existingMeta.customerInfo.name ?? "");
      setCustomerEmail(existingMeta.customerInfo.email ?? "");
      setCustomerCompany(existingMeta.customerInfo.company ?? "");
    }
    setSynced(true);
  }

  // --------------------------------------------------------------------------
  // Mutations
  // --------------------------------------------------------------------------

  const createProposal = api.proposals.create.useMutation({
    onSuccess: (data) => {
      toast.success("Proposal created");
      void utils.portal.getResources.invalidate();
      if (data && onSaved) onSaved(data.id);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateProposal = api.proposals.update.useMutation({
    onSuccess: () => {
      toast.success("Proposal updated");
      void utils.proposals.getById.invalidate({ proposalId: editProposalId });
      void utils.portal.getResources.invalidate();
      if (editProposalId && onSaved) onSaved(editProposalId);
    },
    onError: (err) => toast.error(err.message),
  });

  const isSaving = createProposal.isPending || updateProposal.isPending;

  // --------------------------------------------------------------------------
  // Group/Option handlers
  // --------------------------------------------------------------------------

  const updateGroup = useCallback(
    (groupIdx: number, updates: Partial<CheckoutGroup>) => {
      setCheckoutGroups((prev) =>
        prev.map((g, i) => (i === groupIdx ? { ...g, ...updates } : g))
      );
    },
    []
  );

  const removeGroup = useCallback((groupIdx: number) => {
    setCheckoutGroups((prev) => prev.filter((_, i) => i !== groupIdx));
  }, []);

  const addGroup = useCallback(() => {
    setCheckoutGroups((prev) => [...prev, newGroup()]);
  }, []);

  const updateOption = useCallback(
    (groupIdx: number, optIdx: number, updates: Partial<ProposalOption>) => {
      setCheckoutGroups((prev) =>
        prev.map((g, gi) => {
          if (gi !== groupIdx) return g;
          return {
            ...g,
            options: g.options.map((o, oi) => {
              if (oi !== optIdx) return o;
              const updated = { ...o, ...updates };
              // Recompute total if line items changed
              if (updates.lineItems) {
                updated.totalPrice = computeTotal(updates.lineItems);
              }
              return updated;
            }),
          };
        })
      );
    },
    []
  );

  const removeOption = useCallback((groupIdx: number, optIdx: number) => {
    setCheckoutGroups((prev) =>
      prev.map((g, gi) => {
        if (gi !== groupIdx) return g;
        return {
          ...g,
          options: g.options.filter((_, oi) => oi !== optIdx),
        };
      })
    );
  }, []);

  const addOption = useCallback((groupIdx: number) => {
    setCheckoutGroups((prev) =>
      prev.map((g, gi) => {
        if (gi !== groupIdx) return g;
        return { ...g, options: [...g.options, newOption()] };
      })
    );
  }, []);

  // --------------------------------------------------------------------------
  // Save
  // --------------------------------------------------------------------------

  const handleSave = useCallback(
    (isPrivate: boolean) => {
      if (!title.trim()) {
        toast.error("Title is required");
        return;
      }

      if (checkoutGroups.length === 0) {
        toast.error("At least one checkout group is required");
        return;
      }

      // Validate all groups have names and options with names + line items
      for (const group of checkoutGroups) {
        if (!group.name.trim()) {
          toast.error("All checkout groups need a name");
          return;
        }
        for (const opt of group.options) {
          if (!opt.name.trim()) {
            toast.error(`Option in "${group.name}" needs a name`);
            return;
          }
          if (opt.lineItems.length === 0) {
            toast.error(`Option "${opt.name}" needs at least one line item`);
            return;
          }
          for (const item of opt.lineItems) {
            if (!item.name.trim()) {
              toast.error(`Line item in "${opt.name}" needs a name`);
              return;
            }
          }
        }
      }

      // Compute totals for each option
      const groupsWithTotals = checkoutGroups.map((g) => ({
        ...g,
        options: g.options.map((o) => ({
          ...o,
          totalPrice: computeTotal(o.lineItems),
        })),
      }));

      const richContent = editorRef.current?.getHTML() ?? undefined;

      const common = {
        title: title.trim(),
        description: description.trim() || undefined,
        projectId,
        checkoutGroups: groupsWithTotals,
        richContent:
          richContent && richContent !== "<p></p>" ? richContent : undefined,
        agreementTemplateIds:
          selectedTemplateIds.length > 0 ? selectedTemplateIds : undefined,
        customTerms: customTerms.trim() || undefined,
        currency,
        validUntil: validUntil || undefined,
        status: "draft" as const,
        customerInfo:
          customerName || customerEmail || customerCompany
            ? {
                name: customerName || undefined,
                email: customerEmail || undefined,
                company: customerCompany || undefined,
              }
            : undefined,
      };

      if (editProposalId) {
        updateProposal.mutate({ proposalId: editProposalId, ...common });
      } else {
        createProposal.mutate({ clientSlug: slug, isPrivate, ...common });
      }
    },
    [
      title,
      description,
      projectId,
      checkoutGroups,
      selectedTemplateIds,
      customTerms,
      currency,
      validUntil,
      customerName,
      customerEmail,
      customerCompany,
      editProposalId,
      slug,
      createProposal,
      updateProposal,
    ]
  );

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          <FileText
            className="mr-2 inline h-5 w-5"
            style={{ color: "#D4AF37" }}
          />
          {editProposalId ? "Edit Proposal" : "New Proposal"}
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="proposal-title"
              className="mb-1 block text-sm text-gray-400"
            >
              Title *
            </label>
            <input
              id="proposal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Website Development Package"
              className="w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            />
          </div>

          <div>
            <label
              htmlFor="proposal-desc"
              className="mb-1 block text-sm text-gray-400"
            >
              Description
            </label>
            <textarea
              id="proposal-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of this proposal..."
              rows={2}
              className="w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="proposal-project"
                className="mb-1 block text-sm text-gray-400"
              >
                Project
              </label>
              <select
                id="proposal-project"
                value={projectId ?? ""}
                onChange={(e) =>
                  setProjectId(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full appearance-none rounded-lg border bg-white/5 px-4 py-2.5 pr-9 text-white focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <option value="">Unassigned</option>
                {projects?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="proposal-currency"
                className="mb-1 block text-sm text-gray-400"
              >
                Currency
              </label>
              <select
                id="proposal-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full appearance-none rounded-lg border bg-white/5 px-4 py-2.5 pr-9 text-white focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="proposal-valid-until"
                className="mb-1 block text-sm text-gray-400"
              >
                Valid Until
              </label>
              <input
                id="proposal-valid-until"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="proposal-client-name"
                className="mb-1 block text-sm text-gray-400"
              >
                Client Name
              </label>
              <input
                id="proposal-client-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Auto-fills from client"
                className="w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
            </div>
            <div>
              <label
                htmlFor="proposal-client-email"
                className="mb-1 block text-sm text-gray-400"
              >
                Client Email
              </label>
              <input
                id="proposal-client-email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
            </div>
            <div>
              <label
                htmlFor="proposal-company"
                className="mb-1 block text-sm text-gray-400"
              >
                Company
              </label>
              <input
                id="proposal-company"
                type="text"
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                className="w-full rounded-lg border bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
                style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rich Content */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Proposal Content
        </h2>
        <div
          className="rounded-lg border p-1"
          style={{
            borderColor: "rgba(212, 175, 55, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <RichTextEditor
            ref={editorRef}
            initialContent={existingMeta?.richContent ?? ""}
            placeholder="Describe the scope, deliverables, timeline..."
          />
        </div>
      </section>

      {/* Checkout Groups */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Checkout Groups</h2>
          <button
            onClick={addGroup}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-gray-400 hover:bg-white/5 hover:text-white"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <Plus className="h-4 w-4" />
            Add Group
          </button>
        </div>

        <div className="space-y-6">
          {checkoutGroups.map((group, gi) => (
            <CheckoutGroupEditor
              key={group.id}
              group={group}
              groupIndex={gi}
              onUpdate={updateGroup}
              onRemove={removeGroup}
              onUpdateOption={updateOption}
              onRemoveOption={removeOption}
              onAddOption={addOption}
              currency={currency}
            />
          ))}
        </div>
      </section>

      {/* Terms & Agreements */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Terms & Agreements
        </h2>

        {/* Template selector */}
        {templates && templates.length > 0 && (
          <div className="mb-4">
            <label className="mb-2 block text-sm text-gray-400">
              Agreement Templates
            </label>
            <div className="space-y-2">
              {templates.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedTemplateIds.includes(t.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTemplateIds((prev) => [...prev, t.id]);
                      } else {
                        setSelectedTemplateIds((prev) =>
                          prev.filter((id) => id !== t.id)
                        );
                      }
                    }}
                    className="accent-[#D4AF37]"
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm text-gray-400">
            Custom Terms (Markdown)
          </label>
          <textarea
            value={customTerms}
            onChange={(e) => setCustomTerms(e.target.value)}
            placeholder="Additional terms specific to this proposal..."
            rows={4}
            className="w-full rounded-lg border bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          />
        </div>
      </section>

      {/* Save buttons */}
      <div
        className="flex items-center gap-3 border-t pt-6"
        style={{ borderColor: "rgba(212,175,55,0.2)" }}
      >
        {editProposalId ? (
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-black"
            style={{
              background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
            }}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Update Proposal
          </button>
        ) : (
          <>
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save Draft
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
              }}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save & Publish
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CHECKOUT GROUP EDITOR
// ============================================================================

function CheckoutGroupEditor({
  group,
  groupIndex,
  onUpdate,
  onRemove,
  onUpdateOption,
  onRemoveOption,
  onAddOption,
  currency,
}: {
  group: CheckoutGroup;
  groupIndex: number;
  onUpdate: (idx: number, updates: Partial<CheckoutGroup>) => void;
  onRemove: (idx: number) => void;
  onUpdateOption: (
    gi: number,
    oi: number,
    updates: Partial<ProposalOption>
  ) => void;
  onRemoveOption: (gi: number, oi: number) => void;
  onAddOption: (gi: number) => void;
  currency: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="rounded-lg border"
      style={{
        borderColor: "rgba(212, 175, 55, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
      }}
    >
      {/* Group header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="h-4 w-4 flex-shrink-0 text-gray-600" />
        <input
          type="text"
          value={group.name}
          onChange={(e) => onUpdate(groupIndex, { name: e.target.value })}
          placeholder="Group name (e.g., Website Package)"
          className="flex-1 bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
        />
        <button
          onClick={() => onUpdate(groupIndex, { required: !group.required })}
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
            group.required
              ? "bg-[#D4AF37]/15 text-[#D4AF37]"
              : "bg-white/10 text-gray-500 hover:text-gray-300"
          }`}
        >
          {group.required ? "Required" : "Optional"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand group" : "Collapse group"}
          className="text-gray-500 hover:text-white"
        >
          {collapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => onRemove(groupIndex)}
          aria-label="Delete checkout group"
          className="text-gray-500 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {!collapsed && (
        <div
          className="border-t px-4 py-4"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div className="space-y-4">
            {group.options.map((option, oi) => (
              <OptionEditor
                key={option.id}
                option={option}
                groupIndex={groupIndex}
                optionIndex={oi}
                canRemove={group.options.length > 1}
                onUpdate={onUpdateOption}
                onRemove={onRemoveOption}
                currency={currency}
              />
            ))}
          </div>
          <button
            onClick={() => onAddOption(groupIndex)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#D4AF37]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Option
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// OPTION EDITOR
// ============================================================================

function OptionEditor({
  option,
  groupIndex,
  optionIndex,
  canRemove,
  onUpdate,
  onRemove,
  currency,
}: {
  option: ProposalOption;
  groupIndex: number;
  optionIndex: number;
  canRemove: boolean;
  onUpdate: (gi: number, oi: number, updates: Partial<ProposalOption>) => void;
  onRemove: (gi: number, oi: number) => void;
  currency: string;
}) {
  const total = computeTotal(option.lineItems);

  const togglePaymentMethod = (method: "credit" | "bank") => {
    const current = option.enabledPaymentMethods;
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    if (updated.length === 0) return; // Must have at least one
    onUpdate(groupIndex, optionIndex, { enabledPaymentMethods: updated });
  };

  const updateLineItem = (liIdx: number, updates: Partial<LineItem>) => {
    const newItems = option.lineItems.map((li, i) =>
      i === liIdx ? { ...li, ...updates } : li
    );
    onUpdate(groupIndex, optionIndex, { lineItems: newItems });
  };

  const addLineItem = () => {
    onUpdate(groupIndex, optionIndex, {
      lineItems: [...option.lineItems, newLineItem()],
    });
  };

  const removeLineItem = (liIdx: number) => {
    if (option.lineItems.length <= 1) return;
    onUpdate(groupIndex, optionIndex, {
      lineItems: option.lineItems.filter((_, i) => i !== liIdx),
    });
  };

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        borderColor: "rgba(255, 255, 255, 0.1)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
      }}
    >
      {/* Option header */}
      <div className="mb-3 flex items-center gap-3">
        <input
          type="text"
          value={option.name}
          onChange={(e) =>
            onUpdate(groupIndex, optionIndex, { name: e.target.value })
          }
          placeholder="Option name (e.g., Basic Plan)"
          className="flex-1 rounded border bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none"
          style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
        />
        <select
          value={option.paymentType}
          onChange={(e) =>
            onUpdate(groupIndex, optionIndex, {
              paymentType: e.target.value as "one-time" | "recurring",
              recurringInterval:
                e.target.value === "recurring" ? "month" : undefined,
            })
          }
          className="appearance-none rounded border bg-white/5 px-2 py-1.5 text-xs text-gray-300"
          style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
        >
          <option value="one-time">One-time</option>
          <option value="recurring">Recurring</option>
        </select>
        {option.paymentType === "recurring" && (
          <select
            value={option.recurringInterval ?? "month"}
            onChange={(e) =>
              onUpdate(groupIndex, optionIndex, {
                recurringInterval: e.target.value as "month" | "year",
              })
            }
            className="appearance-none rounded border bg-white/5 px-2 py-1.5 text-xs text-gray-300"
            style={{ borderColor: "rgba(212, 175, 55, 0.15)" }}
          >
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        )}
        {canRemove && (
          <button
            onClick={() => onRemove(groupIndex, optionIndex)}
            aria-label="Delete option"
            className="text-gray-500 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Description */}
      <input
        type="text"
        value={option.description ?? ""}
        onChange={(e) =>
          onUpdate(groupIndex, optionIndex, {
            description: e.target.value || undefined,
          })
        }
        placeholder="Option description (optional)"
        className="mb-3 w-full rounded border bg-white/5 px-3 py-1.5 text-sm text-gray-400 placeholder:text-gray-600 focus:outline-none"
        style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
      />

      {/* Line items */}
      <div className="mb-3 space-y-2">
        <div className="grid grid-cols-[1fr_60px_100px_32px] gap-2 text-xs text-gray-500">
          <span>Item</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Price ($)</span>
          <span />
        </div>
        {option.lineItems.map((item, li) => (
          <div key={li} className="grid grid-cols-[1fr_60px_100px_32px] gap-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateLineItem(li, { name: e.target.value })}
              placeholder="Line item name"
              className="rounded border bg-white/5 px-2 py-1 text-sm text-white placeholder:text-gray-600 focus:outline-none"
              style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
            />
            <input
              type="number"
              value={item.qty}
              onChange={(e) =>
                updateLineItem(li, {
                  qty: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
              min={1}
              className="rounded border bg-white/5 px-2 py-1 text-right text-sm text-white focus:outline-none"
              style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
            />
            <input
              type="number"
              value={item.unitPrice / 100}
              onChange={(e) =>
                updateLineItem(li, {
                  unitPrice: Math.round(
                    (parseFloat(e.target.value) || 0) * 100
                  ),
                })
              }
              step="0.01"
              min="0"
              className="rounded border bg-white/5 px-2 py-1 text-right text-sm text-white focus:outline-none"
              style={{ borderColor: "rgba(255, 255, 255, 0.05)" }}
            />
            <button
              onClick={() => removeLineItem(li)}
              aria-label="Remove line item"
              className="text-gray-600 hover:text-red-400"
              disabled={option.lineItems.length <= 1}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          onClick={addLineItem}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#D4AF37]"
        >
          <Plus className="h-3 w-3" />
          Add line item
        </button>
      </div>

      {/* Payment methods + total */}
      <div
        className="flex items-center justify-between border-t pt-3"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Payment:</span>
          {(
            [
              {
                key: "credit" as const,
                icon: CreditCard,
                label: "Credit Card",
              },
              { key: "bank" as const, icon: Landmark, label: "Bank Transfer" },
            ] as const
          ).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => togglePaymentMethod(key)}
              className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                option.enabledPaymentMethods.includes(key)
                  ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                  : "bg-white/5 text-gray-500 hover:text-gray-300"
              }`}
              title={label}
              aria-label={`${option.enabledPaymentMethods.includes(key) ? "Disable" : "Enable"} ${label}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        <span className="text-sm font-medium text-white">
          Total: ${formatCents(total)}
        </span>
      </div>
    </div>
  );
}
