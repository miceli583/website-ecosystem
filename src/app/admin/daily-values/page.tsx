"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

export const dynamic = "force-dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { BackButton } from "~/components/back-button";
import {
  Heart,
  Lightbulb,
  Quote,
  Sparkles,
  CalendarClock,
  Plus,
  Edit,
  Trash2,
  Send,
  Loader2,
  Shuffle,
  Repeat,
  AlertTriangle,
  ChevronDown,
  Check,
  X as XIcon,
  Palette,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import {
  generateCarousel,
  type CarouselContent,
} from "~/lib/carousel-generator";
import {
  DEFAULT_THEME,
  BRAND_THEMES,
  type BrandTheme,
} from "~/lib/brand-themes";
import Image from "next/image";
import type { Author, CoreValue, SupportingValue } from "~/server/db/schema";

// Type aliases for API query results
type QuoteWithAuthor = {
  id: string;
  text: string;
  source: string | null;
  category: string | null;
  tags: string[] | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string | null;
  authorName: string | null;
};

type CoreValueInfo = {
  id: string;
  value: string;
  description: string;
};

type AuthorWithCount = {
  id: string;
  name: string;
  quoteCount: number;
};

type PostQueueItem = {
  id: string;
  coreValueId: string;
  quoteId: string;
  isPublished: string;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  queuePosition: string | null;
  caption: string | null;
  imageUrl: string | null;
  createdAt: Date;
};

function DailyValuesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const domain = searchParams.get("domain");
  const domainParam = domain ? `?domain=${domain}` : "";

  // Get current tab from URL or default to "core-values"
  const currentTab = searchParams.get("tab") ?? "core-values";

  // ==========================================================================
  // SUPPORTING VALUES STATE
  // ==========================================================================
  const [supportingValueDialog, setSupportingValueDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    id?: string;
    value?: string;
  }>({ open: false, mode: "add" });

  const [supportingValueForm, setSupportingValueForm] = useState({ value: "" });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    open: boolean;
    type: "supporting" | "core" | "author" | "quote";
    id?: string;
    name?: string;
    requiresConfirmation?: boolean;
    coreValueId?: string;
    message?: string;
  }>({ open: false, type: "supporting" });

  // ==========================================================================
  // CORE VALUES STATE
  // ==========================================================================
  const [coreValueDialog, setCoreValueDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    id?: string;
  }>({ open: false, mode: "add" });

  const [coreValueForm, setCoreValueForm] = useState({
    inputMode: "dropdown" as "dropdown" | "manual",
    supportingValueId: "",
    manualValue: "",
    description: "",
  });

  // ==========================================================================
  // AUTHORS STATE
  // ==========================================================================
  const [authorDialog, setAuthorDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    id?: string;
  }>({ open: false, mode: "add" });

  const [authorForm, setAuthorForm] = useState({ name: "" });

  // ==========================================================================
  // QUOTES STATE
  // ==========================================================================
  const [quoteDialog, setQuoteDialog] = useState<{
    open: boolean;
    mode: "add" | "edit";
    id?: string;
  }>({ open: false, mode: "add" });

  const [quoteForm, setQuoteForm] = useState({
    text: "",
    authorId: "",
    newAuthorName: "",
    source: "",
    category: "",
    tags: "",
    coreValueIds: [] as string[],
    coreValuesExpanded: false,
  });

  // ==========================================================================
  // GENERATE POST STATE
  // ==========================================================================
  const [selectedCoreValueId, setSelectedCoreValueId] = useState<string>("");
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<BrandTheme>(DEFAULT_THEME);
  const [generatedImages, setGeneratedImages] = useState<{
    page1: string;
    page2: string;
    page3: string;
  } | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // ==========================================================================
  // QUEUE STATE
  // ==========================================================================
  const [expandedQueueItems, setExpandedQueueItems] = useState<Set<string>>(
    new Set()
  );
  const [queueItemImages, setQueueItemImages] = useState<
    Map<
      string,
      {
        page1: string;
        page2: string;
        page3: string;
        theme: BrandTheme;
      }
    >
  >(new Map());
  const [queueItemThemes, setQueueItemThemes] = useState<
    Map<string, BrandTheme>
  >(new Map());
  const [generatingQueueItems, setGeneratingQueueItems] = useState<Set<string>>(
    new Set()
  );
  const [queueItemCaptions, setQueueItemCaptions] = useState<
    Map<string, string>
  >(new Map());

  // ==========================================================================
  // BUFFER STATION STATE
  // ==========================================================================
  const [bufferActive, setBufferActive] = useState(false);
  const [bufferPayload, setBufferPayload] = useState<any>(null);
  const [bufferTimeRemaining, setBufferTimeRemaining] = useState(120); // 2 minutes in seconds
  const [bufferEndTime, setBufferEndTime] = useState<number | null>(null);

  // ==========================================================================
  // DATA QUERIES
  // ==========================================================================
  const utils = api.useUtils();
  const { data: stats, error: statsError } =
    api.dailyValues.getStats.useQuery();
  const {
    data: coreValues,
    isLoading: coreValuesLoading,
    error: coreValuesError,
  } = api.dailyValues.getAllCoreValues.useQuery();
  const {
    data: supportingValues,
    isLoading: supportingValuesLoading,
    error: supportingValuesError,
  } = api.dailyValues.getAllSupportingValues.useQuery();
  const {
    data: availableSupportingValues,
    error: availableSupportingValuesError,
  } = api.dailyValues.getAvailableSupportingValues.useQuery();
  const {
    data: quotes,
    isLoading: quotesLoading,
    error: quotesError,
  } = api.dailyValues.getAllQuotes.useQuery();
  const { data: authors, error: authorsError } =
    api.dailyValues.getAllAuthors.useQuery();
  const { data: authorsWithCounts, error: authorsWithCountsError } =
    api.dailyValues.getAuthorsWithQuoteCounts.useQuery();
  const {
    data: postQueue,
    isLoading: queueLoading,
    error: queueError,
  } = api.dailyValues.getPostQueue.useQuery();

  // Log errors in development for debugging
  useEffect(() => {
    const errors = {
      stats: statsError,
      coreValues: coreValuesError,
      supportingValues: supportingValuesError,
      availableSupportingValues: availableSupportingValuesError,
      quotes: quotesError,
      authors: authorsError,
      authorsWithCounts: authorsWithCountsError,
      queue: queueError,
    };

    const hasErrors = Object.values(errors).some(
      (e) => e !== undefined && e !== null
    );
    if (hasErrors) {
      console.error("[Daily Values] API Errors:", errors);
    }
  }, [
    statsError,
    coreValuesError,
    supportingValuesError,
    availableSupportingValuesError,
    quotesError,
    authorsError,
    authorsWithCountsError,
    queueError,
  ]);

  // Fetch Core Values for selected quote (when editing)
  const { data: quoteCoreValues } =
    api.dailyValues.getCoreValuesByQuote.useQuery(
      { quoteId: quoteDialog.id ?? "" },
      { enabled: quoteDialog.mode === "edit" && !!quoteDialog.id }
    );

  // ==========================================================================
  // MUTATIONS
  // ==========================================================================

  // Supporting Values
  const createSupportingValue =
    api.dailyValues.createSupportingValue.useMutation({
      onSuccess: () => {
        void utils.dailyValues.getAllSupportingValues.invalidate();
        void utils.dailyValues.getAvailableSupportingValues.invalidate();
        void utils.dailyValues.getStats.invalidate();
        setSupportingValueDialog({ open: false, mode: "add" });
        setSupportingValueForm({ value: "" });
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });

  const updateSupportingValue =
    api.dailyValues.updateSupportingValue.useMutation({
      onSuccess: () => {
        void utils.dailyValues.getAllSupportingValues.invalidate();
        setSupportingValueDialog({ open: false, mode: "add" });
        setSupportingValueForm({ value: "" });
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });

  const deleteSupportingValue =
    api.dailyValues.deleteSupportingValue.useMutation({
      onSuccess: (data) => {
        if (data.requiresConfirmation) {
          setDeleteConfirmDialog({
            open: true,
            type: "supporting",
            id: deleteConfirmDialog.id,
            requiresConfirmation: true,
            coreValueId: data.coreValueId,
            message: data.message,
          });
        } else {
          void utils.dailyValues.getAllSupportingValues.invalidate();
          void utils.dailyValues.getAvailableSupportingValues.invalidate();
          void utils.dailyValues.getStats.invalidate();
          setDeleteConfirmDialog({ open: false, type: "supporting" });
        }
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });

  const confirmDeleteSupportingValue =
    api.dailyValues.confirmDeleteSupportingValue.useMutation({
      onSuccess: () => {
        void utils.dailyValues.getAllSupportingValues.invalidate();
        void utils.dailyValues.getAllCoreValues.invalidate();
        void utils.dailyValues.getAvailableSupportingValues.invalidate();
        void utils.dailyValues.getStats.invalidate();
        setDeleteConfirmDialog({ open: false, type: "supporting" });
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });

  // Core Values
  const createCoreValue = api.dailyValues.createCoreValue.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllCoreValues.invalidate();
      void utils.dailyValues.getAvailableSupportingValues.invalidate();
      void utils.dailyValues.getStats.invalidate();
      setCoreValueDialog({ open: false, mode: "add" });
      setCoreValueForm({
        inputMode: "dropdown",
        supportingValueId: "",
        manualValue: "",
        description: "",
      });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const updateCoreValue = api.dailyValues.updateCoreValue.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllCoreValues.invalidate();
      setCoreValueDialog({ open: false, mode: "add" });
      setCoreValueForm({
        inputMode: "dropdown",
        supportingValueId: "",
        manualValue: "",
        description: "",
      });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const deleteCoreValue = api.dailyValues.deleteCoreValue.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllCoreValues.invalidate();
      void utils.dailyValues.getAvailableSupportingValues.invalidate();
      void utils.dailyValues.getStats.invalidate();
      setDeleteConfirmDialog({ open: false, type: "core" });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Authors
  const createAuthor = api.dailyValues.createAuthor.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllAuthors.invalidate();
      void utils.dailyValues.getStats.invalidate();
      setAuthorDialog({ open: false, mode: "add" });
      setAuthorForm({ name: "" });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const updateAuthor = api.dailyValues.updateAuthor.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllAuthors.invalidate();
      setAuthorDialog({ open: false, mode: "add" });
      setAuthorForm({ name: "" });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const deleteAuthor = api.dailyValues.deleteAuthor.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllAuthors.invalidate();
      void utils.dailyValues.getStats.invalidate();
      setDeleteConfirmDialog({ open: false, type: "author" });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Quotes
  const createQuote = api.dailyValues.createQuote.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllQuotes.invalidate();
      void utils.dailyValues.getAllAuthors.invalidate();
      void utils.dailyValues.getAuthorsWithQuoteCounts.invalidate();
      void utils.dailyValues.getStats.invalidate();
      setQuoteDialog({ open: false, mode: "add" });
      setQuoteForm({
        text: "",
        authorId: "",
        newAuthorName: "",
        source: "",
        category: "",
        tags: "",
        coreValueIds: [],
        coreValuesExpanded: false,
      });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const updateQuote = api.dailyValues.updateQuote.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllQuotes.invalidate();
      void utils.dailyValues.getAuthorsWithQuoteCounts.invalidate();
      setQuoteDialog({ open: false, mode: "add" });
      setQuoteForm({
        text: "",
        authorId: "",
        newAuthorName: "",
        source: "",
        category: "",
        tags: "",
        coreValueIds: [],
        coreValuesExpanded: false,
      });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const updateQuoteCoreValues =
    api.dailyValues.updateQuoteCoreValues.useMutation({
      onSuccess: () => {
        void utils.dailyValues.getCoreValuesByQuote.invalidate();
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });

  const deleteQuote = api.dailyValues.deleteQuote.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getAllQuotes.invalidate();
      void utils.dailyValues.getStats.invalidate();
      setDeleteConfirmDialog({ open: false, type: "quote" });
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Queue Management Mutations
  const fillQueue = api.dailyValues.fillQueue.useMutation({
    onSuccess: (data) => {
      void utils.dailyValues.getPostQueue.invalidate();
      void utils.dailyValues.getStats.invalidate();
      alert(data.message);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const popQueue = api.dailyValues.popQueue.useMutation({
    onSuccess: (data) => {
      void utils.dailyValues.getPostQueue.invalidate();
      void utils.dailyValues.getStats.invalidate();
      alert(data.message);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const enqueuePost = api.dailyValues.enqueuePost.useMutation({
    onSuccess: (data) => {
      void utils.dailyValues.getPostQueue.invalidate();
      void utils.dailyValues.getStats.invalidate();
      alert(data.message);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const rotateQueue = api.dailyValues.rotateQueue.useMutation({
    onSuccess: (data) => {
      void utils.dailyValues.getPostQueue.invalidate();
      void utils.dailyValues.getStats.invalidate();
      alert(data.message);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const deleteQueueItem = api.dailyValues.deleteQueueItem.useMutation({
    onSuccess: (data) => {
      void utils.dailyValues.getPostQueue.invalidate();
      void utils.dailyValues.getStats.invalidate();
      alert(data.message);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const clearQueue = api.dailyValues.clearQueue.useMutation({
    onSuccess: (data) => {
      void utils.dailyValues.getPostQueue.invalidate();
      void utils.dailyValues.getStats.invalidate();
      alert(data.message);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const updateQueueItem = api.dailyValues.updateQueueItem.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getPostQueue.invalidate();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Pending Posts (Buffer Station)
  const upsertPendingPost = api.dailyValues.upsertPendingPost.useMutation({
    onSuccess: () => {
      void utils.dailyValues.getCurrentPendingPost.invalidate();
    },
    onError: (error) => {
      alert(`Error creating pending post: ${error.message}`);
    },
  });

  // Poll pending post every second when buffer is active
  const { data: currentPendingPost } =
    api.dailyValues.getCurrentPendingPost.useQuery(undefined, {
      refetchInterval: bufferActive ? 1000 : false, // Poll every second when buffer active
      enabled: bufferActive,
    });

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  // Supporting Values Handlers
  const handleAddSupportingValue = () => {
    setSupportingValueDialog({ open: true, mode: "add" });
    setSupportingValueForm({ value: "" });
  };

  const handleEditSupportingValue = (id: string, value: string) => {
    setSupportingValueDialog({ open: true, mode: "edit", id, value });
    setSupportingValueForm({ value });
  };

  const handleDeleteSupportingValue = (id: string, name: string) => {
    setDeleteConfirmDialog({ open: true, type: "supporting", id, name });
  };

  const handleSupportingValueSubmit = () => {
    if (supportingValueDialog.mode === "add") {
      createSupportingValue.mutate({ value: supportingValueForm.value });
    } else if (supportingValueDialog.id) {
      updateSupportingValue.mutate({
        id: supportingValueDialog.id,
        value: supportingValueForm.value,
      });
    }
  };

  // Core Values Handlers
  const handleAddCoreValue = () => {
    setCoreValueDialog({ open: true, mode: "add" });
    setCoreValueForm({
      inputMode: "dropdown",
      supportingValueId: "",
      manualValue: "",
      description: "",
    });
  };

  const handleEditCoreValue = (
    id: string,
    value: string,
    description: string
  ) => {
    setCoreValueDialog({ open: true, mode: "edit", id });
    setCoreValueForm({
      inputMode: "manual",
      supportingValueId: "",
      manualValue: value,
      description,
    });
  };

  const handleDeleteCoreValue = (id: string, name: string) => {
    setDeleteConfirmDialog({ open: true, type: "core", id, name });
  };

  const handleCoreValueSubmit = () => {
    if (coreValueDialog.mode === "add") {
      const value =
        coreValueForm.inputMode === "dropdown"
          ? (availableSupportingValues?.find(
              (sv: any) => sv.id === coreValueForm.supportingValueId
            )?.value ?? "")
          : coreValueForm.manualValue;

      createCoreValue.mutate({
        value,
        description: coreValueForm.description,
        fromSupportingValueId:
          coreValueForm.inputMode === "dropdown"
            ? coreValueForm.supportingValueId
            : undefined,
      });
    } else if (coreValueDialog.id) {
      updateCoreValue.mutate({
        id: coreValueDialog.id,
        description: coreValueForm.description,
      });
    }
  };

  // Authors Handlers
  const handleAddAuthor = () => {
    setAuthorDialog({ open: true, mode: "add" });
    setAuthorForm({ name: "" });
  };

  const handleEditAuthor = (id: string, name: string) => {
    setAuthorDialog({ open: true, mode: "edit", id });
    setAuthorForm({ name });
  };

  const handleDeleteAuthor = (id: string, name: string) => {
    setDeleteConfirmDialog({ open: true, type: "author", id, name });
  };

  const handleAuthorSubmit = () => {
    if (authorDialog.mode === "add") {
      createAuthor.mutate({ name: authorForm.name });
    } else if (authorDialog.id) {
      updateAuthor.mutate({ id: authorDialog.id, name: authorForm.name });
    }
  };

  // Quotes Handlers
  const handleAddQuote = () => {
    setQuoteDialog({ open: true, mode: "add" });
    setQuoteForm({
      text: "",
      authorId: "",
      newAuthorName: "",
      source: "",
      category: "",
      tags: "",
      coreValueIds: [],
      coreValuesExpanded: false,
    });
  };

  const handleEditQuote = (quote: any) => {
    setQuoteDialog({ open: true, mode: "edit", id: quote.id });
    setQuoteForm({
      text: quote.text,
      authorId: quote.authorId ?? "",
      newAuthorName: "",
      source: quote.source ?? "",
      category: quote.category ?? "",
      tags: quote.tags?.join(", ") ?? "",
      coreValueIds: [], // Will be populated by useEffect when quoteCoreValues loads
      coreValuesExpanded: false,
    });
  };

  const handleDeleteQuote = (id: string, text: string) => {
    setDeleteConfirmDialog({
      open: true,
      type: "quote",
      id,
      name: text.substring(0, 50) + "...",
    });
  };

  const handleQuoteSubmit = async () => {
    const tags = quoteForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    let finalAuthorId = quoteForm.authorId;

    // If user selected "Add New Author", create the author first
    if (quoteForm.authorId === "NEW_AUTHOR" && quoteForm.newAuthorName.trim()) {
      // Check for duplicate author name
      const isDuplicate = authors?.some(
        (a: Author) =>
          a.name.toLowerCase() === quoteForm.newAuthorName.trim().toLowerCase()
      );

      if (isDuplicate) {
        alert(
          `Author "${quoteForm.newAuthorName}" already exists. Please select them from the dropdown.`
        );
        return;
      }

      // Create new author
      try {
        const newAuthor = await createAuthor.mutateAsync({
          name: quoteForm.newAuthorName,
        });
        finalAuthorId = newAuthor.id;
      } catch (error) {
        alert("Failed to create new author. Please try again.");
        return;
      }
    }

    if (quoteDialog.mode === "add") {
      createQuote.mutate({
        text: quoteForm.text,
        authorId:
          finalAuthorId !== "NEW_AUTHOR"
            ? finalAuthorId || undefined
            : undefined,
        source: quoteForm.source || undefined,
        category: quoteForm.category || undefined,
        tags: tags.length > 0 ? tags : undefined,
        coreValueIds:
          quoteForm.coreValueIds.length > 0
            ? quoteForm.coreValueIds
            : undefined,
      });
    } else if (quoteDialog.id) {
      // Update quote
      updateQuote.mutate({
        id: quoteDialog.id,
        text: quoteForm.text,
        authorId: finalAuthorId !== "NEW_AUTHOR" ? finalAuthorId || null : null,
        source: quoteForm.source || null,
        category: quoteForm.category || null,
        tags: tags.length > 0 ? tags : null,
      });

      // Update Core Value associations
      updateQuoteCoreValues.mutate({
        quoteId: quoteDialog.id,
        coreValueIds: quoteForm.coreValueIds,
      });
    }
  };

  // Populate Core Values when editing a quote
  useEffect(() => {
    if (quoteDialog.mode === "edit" && quoteCoreValues) {
      setQuoteForm((prev) => ({
        ...prev,
        coreValueIds: quoteCoreValues.map((cv: CoreValueInfo) => cv.id),
      }));
    }
  }, [quoteCoreValues, quoteDialog.mode]);

  // Restore buffer state from database on mount
  useEffect(() => {
    if (currentPendingPost && currentPendingPost.status === "pending") {
      const now = Date.now();
      const endTime = new Date(currentPendingPost.scheduledFor).getTime();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

      if (remaining > 0) {
        const payload = JSON.parse(currentPendingPost.zapierPayload);
        setBufferPayload(payload);
        setBufferEndTime(endTime);
        setBufferTimeRemaining(remaining);
        setBufferActive(true);
      } else if (remaining <= 0) {
        // Post should have been sent by backend already
        setBufferActive(false);
        setBufferPayload(null);
        setBufferTimeRemaining(120);
        setBufferEndTime(null);
      }
    } else if (currentPendingPost?.status === "sent") {
      // Post was sent, clear buffer
      setBufferActive(false);
      setBufferPayload(null);
      setBufferTimeRemaining(120);
      setBufferEndTime(null);
    }
  }, [currentPendingPost]);

  // Buffer Station Countdown Timer (sync from database)
  useEffect(() => {
    if (!bufferActive || !bufferEndTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((bufferEndTime - now) / 1000));
      setBufferTimeRemaining(remaining);

      // When countdown reaches 0, the backend (pg_cron) will handle sending to Zapier
      // We just clear the buffer UI after a delay to show "sent" state
      if (remaining <= 0) {
        // Check status from database - if sent, clear buffer
        setTimeout(() => {
          if (currentPendingPost?.status === "sent") {
            setBufferActive(false);
            setBufferPayload(null);
            setBufferTimeRemaining(120);
            setBufferEndTime(null);
          }
        }, 2000); // Wait 2 seconds for backend to process
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [bufferActive, bufferEndTime, currentPendingPost]);

  // Delete Confirmation Handler
  const handleConfirmDelete = () => {
    if (deleteConfirmDialog.type === "supporting" && deleteConfirmDialog.id) {
      if (
        deleteConfirmDialog.requiresConfirmation &&
        deleteConfirmDialog.coreValueId
      ) {
        confirmDeleteSupportingValue.mutate({
          id: deleteConfirmDialog.id,
          coreValueId: deleteConfirmDialog.coreValueId,
        });
      } else {
        deleteSupportingValue.mutate({ id: deleteConfirmDialog.id });
      }
    } else if (deleteConfirmDialog.type === "core" && deleteConfirmDialog.id) {
      deleteCoreValue.mutate({ id: deleteConfirmDialog.id });
    } else if (
      deleteConfirmDialog.type === "author" &&
      deleteConfirmDialog.id
    ) {
      deleteAuthor.mutate({ id: deleteConfirmDialog.id });
    } else if (deleteConfirmDialog.type === "quote" && deleteConfirmDialog.id) {
      deleteQuote.mutate({ id: deleteConfirmDialog.id });
    }
  };

  // Tab change handler
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Random combination query
  const { refetch: fetchRandomCombination, isFetching: isLoadingRandom } =
    api.dailyValues.getRandomCombination.useQuery(undefined, {
      enabled: false,
    });

  const handleRandomize = async () => {
    const result = await fetchRandomCombination();
    if (result.data) {
      setSelectedCoreValueId(result.data.coreValue.id);
      setSelectedQuoteId(result.data.quote!.id);
    }
  };

  // Generate Instagram caption
  const generateCaption = (
    valueName: string,
    valueDescription: string,
    quoteText: string,
    authorName: string
  ): string => {
    // Only show author if it exists, has content, and is not "Unknown"
    const authorLine =
      authorName && authorName.trim() && authorName.toLowerCase() !== "unknown"
        ? `— ${authorName}\n\n`
        : "\n";
    const caption = `Welcome to your Daily Anchor ⚓

"${quoteText}"
${authorLine}Today's Value: ${valueName.toUpperCase()}
${valueDescription}

Living with an embodied value system means letting principles like ${valueName} guide your decisions, shape your character, and anchor you in what truly matters on a moment to moment basis.

💭 What does this mean for you today? How will you embody it?

📌 Be sure to Save and Share with likeminded friends!

#DailyAnchor #${valueName.replace(/\s+/g, "")} #PersonalGrowth #Mindfulness #SelfDevelopment #EmbodiedValues #Purpose #Wisdom #MiracleMind`;

    return caption;
  };

  // Handle Generate button
  const handleGenerate = async () => {
    if (!selectedCoreValueId || !selectedQuoteId) {
      alert("Please select a value and quote first");
      return;
    }

    setIsGenerating(true);
    try {
      const coreValue = coreValues?.find(
        (cv: CoreValue) => cv.id === selectedCoreValueId
      );
      const quote = quotes?.find(
        (q: QuoteWithAuthor) => q.id === selectedQuoteId
      );

      if (!coreValue || !quote) {
        throw new Error("Could not find selected items");
      }

      const content: CarouselContent = {
        quote: {
          text: quote.text,
          author: quote.authorName ?? "Unknown",
        },
        value: {
          name: coreValue.value,
          description: coreValue.description,
        },
      };

      const carousel = await generateCarousel(content, selectedTheme);
      const page1Url = URL.createObjectURL(carousel.page1);
      const page2Url = URL.createObjectURL(carousel.page2);
      const page3Url = URL.createObjectURL(carousel.page3);

      const caption = generateCaption(
        coreValue.value,
        coreValue.description,
        quote.text,
        quote.authorName ?? "Unknown"
      );

      setGeneratedImages({ page1: page1Url, page2: page2Url, page3: page3Url });
      setGeneratedCaption(caption);
    } catch (error) {
      console.error("Error generating carousel:", error);
      alert("Failed to generate carousel. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Theme Change - regenerate images with new theme if they exist
  const handleThemeChange = async (theme: BrandTheme) => {
    setSelectedTheme(theme);

    // If images are already generated, regenerate with new theme
    if (generatedImages && selectedCoreValueId && selectedQuoteId) {
      setIsGenerating(true);
      try {
        const coreValue = coreValues?.find(
          (cv: CoreValue) => cv.id === selectedCoreValueId
        );
        const quote = quotes?.find(
          (q: QuoteWithAuthor) => q.id === selectedQuoteId
        );

        if (!coreValue || !quote) return;

        const content: CarouselContent = {
          quote: {
            text: quote.text,
            author: quote.authorName ?? "",
          },
          value: {
            name: coreValue.value,
            description: coreValue.description,
          },
        };

        const carousel = await generateCarousel(content, theme);
        const page1Url = URL.createObjectURL(carousel.page1);
        const page2Url = URL.createObjectURL(carousel.page2);
        const page3Url = URL.createObjectURL(carousel.page3);

        setGeneratedImages({
          page1: page1Url,
          page2: page2Url,
          page3: page3Url,
        });
      } catch (error) {
        console.error("Error regenerating with new theme:", error);
        alert("Failed to apply theme. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Handle Post to Instagram
  const handlePost = async () => {
    if (!generatedImages) return;

    const coreValue = coreValues?.find(
      (cv: CoreValue) => cv.id === selectedCoreValueId
    );
    const quote = quotes?.find(
      (q: QuoteWithAuthor) => q.id === selectedQuoteId
    );

    if (!coreValue || !quote) return;

    try {
      // Use our API route to avoid CORS issues
      const apiUrl = "/api/post-to-instagram";

      const content: CarouselContent = {
        quote: {
          text: quote.text,
          author: quote.authorName ?? "Unknown",
        },
        value: {
          name: coreValue.value,
          description: coreValue.description,
        },
      };

      const carousel = await generateCarousel(content, selectedTheme);

      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            // Keep full data URL with MIME type (data:image/jpeg;base64,...)
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const page1Base64 = await blobToBase64(carousel.page1);
      const page2Base64 = await blobToBase64(carousel.page2);
      const page3Base64 = await blobToBase64(carousel.page3);

      const caption =
        generatedCaption ||
        generateCaption(
          coreValue.value,
          coreValue.description,
          quote.text,
          quote.authorName ?? "Unknown"
        );

      const payload = {
        images: {
          page1: page1Base64,
          page2: page2Base64,
          page3: page3Base64,
        },
        caption: caption,
        metadata: {
          value: coreValue.value,
          valueDescription: coreValue.description,
          quote: quote.text,
          author: quote.authorName ?? "Unknown",
          timestamp: new Date().toISOString(),
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Webhook failed: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error posting to Zapier:", error);
    }
  };

  // ==========================================================================
  // QUEUE HANDLERS
  // ==========================================================================

  const toggleQueueItemExpanded = (postId: string) => {
    setExpandedQueueItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleGenerateQueueItemImages = async (
    post: PostQueueItem,
    overrideTheme?: BrandTheme
  ) => {
    // Add to generating set
    setGeneratingQueueItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(post.id);
      return newSet;
    });

    try {
      const coreValue = coreValues?.find(
        (cv: CoreValue) => cv.id === post.coreValueId
      );
      const quote = quotes?.find((q: QuoteWithAuthor) => q.id === post.quoteId);

      console.log("Found coreValue:", coreValue);
      console.log("Found quote:", quote);

      if (!coreValue || !quote) {
        throw new Error("Could not find core value or quote");
      }

      if (!coreValue.value || !coreValue.description || !quote.text) {
        throw new Error(
          `Missing required fields - value: ${coreValue.value}, description: ${coreValue.description}, quote: ${quote.text}`
        );
      }

      // Use override theme if provided, otherwise get from state
      const theme =
        overrideTheme ?? queueItemThemes.get(post.id) ?? DEFAULT_THEME;

      const content: CarouselContent = {
        value: {
          name: coreValue.value,
          description: coreValue.description,
        },
        quote: {
          text: quote.text,
          author: quote.authorName ?? "Unknown",
        },
      };

      console.log("Generating carousel for:", post.id, content, theme);
      const carousel = await generateCarousel(content, theme);
      console.log("Generated carousel:", carousel);

      // Convert Blobs to object URLs (same as Generate tab)
      const page1Url = URL.createObjectURL(carousel.page1);
      const page2Url = URL.createObjectURL(carousel.page2);
      const page3Url = URL.createObjectURL(carousel.page3);

      console.log("Created URLs:", { page1Url, page2Url, page3Url });

      // Generate caption
      const caption = generateCaption(
        coreValue.value,
        coreValue.description,
        quote.text,
        quote.authorName ?? "Unknown"
      );

      // Store images
      setQueueItemImages((prev) => {
        const newMap = new Map(prev);
        newMap.set(post.id, {
          page1: page1Url,
          page2: page2Url,
          page3: page3Url,
          theme,
        });
        return newMap;
      });

      // Store caption
      setQueueItemCaptions((prev) => {
        const newMap = new Map(prev);
        newMap.set(post.id, caption);
        return newMap;
      });
    } catch (error) {
      console.error("Error generating queue item images:", error);
      alert(
        `Error generating images: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      // Remove from generating set
      setGeneratingQueueItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(post.id);
        return newSet;
      });
    }
  };

  const handleQueueItemThemeChange = async (
    postId: string,
    newTheme: BrandTheme
  ) => {
    setQueueItemThemes((prev) => {
      const newMap = new Map(prev);
      newMap.set(postId, newTheme);
      return newMap;
    });

    // If images already exist, regenerate with new theme
    const existingImages = queueItemImages.get(postId);
    if (existingImages) {
      const post = postQueue?.find((p: PostQueueItem) => p.id === postId);
      if (post) {
        // Pass the new theme directly to avoid stale state
        await handleGenerateQueueItemImages(post, newTheme);
      }
    }
  };

  const handleDeleteQueueItem = (postId: string) => {
    if (confirm("Are you sure you want to remove this post from the queue?")) {
      deleteQueueItem.mutate({ id: postId });
    }
  };

  // Helper function to post a queue item to Instagram
  const handlePostQueueItem = async (post: PostQueueItem) => {
    const coreValue = coreValues?.find(
      (cv: CoreValue) => cv.id === post.coreValueId
    );
    const quote = quotes?.find((q: QuoteWithAuthor) => q.id === post.quoteId);

    if (!coreValue || !quote) {
      console.error("Error: Could not find value or quote data");
      return;
    }

    try {
      const apiUrl = "/api/post-to-instagram";
      const theme = queueItemThemes.get(post.id) ?? DEFAULT_THEME;

      const content: CarouselContent = {
        quote: {
          text: quote.text,
          author: quote.authorName ?? "Unknown",
        },
        value: {
          name: coreValue.value,
          description: coreValue.description,
        },
      };

      const carousel = await generateCarousel(content, theme);

      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const page1Base64 = await blobToBase64(carousel.page1);
      const page2Base64 = await blobToBase64(carousel.page2);
      const page3Base64 = await blobToBase64(carousel.page3);

      const caption =
        queueItemCaptions.get(post.id) ||
        generateCaption(
          coreValue.value,
          coreValue.description,
          quote.text,
          quote.authorName ?? "Unknown"
        );

      const payload = {
        images: {
          page1: page1Base64,
          page2: page2Base64,
          page3: page3Base64,
        },
        caption,
        metadata: {
          value: coreValue.value,
          valueDescription: coreValue.description,
          quote: quote.text,
          author: quote.authorName ?? "Unknown",
          timestamp: new Date().toISOString(),
        },
        dryRun: true, // Enable dry run mode - skip Zapier, return payload preview
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }

      const result = await response.json();
    } catch (error) {
      console.error("Error posting to Instagram:", error);
      throw error; // Re-throw to handle in calling function
    }
  };

  const handlePopAndPost = async () => {
    if (!postQueue || postQueue.length === 0) return;

    const firstItem = postQueue[0];
    if (!firstItem) return;

    const coreValue = coreValues?.find(
      (cv: CoreValue) => cv.id === firstItem.coreValueId
    );
    const quote = quotes?.find(
      (q: QuoteWithAuthor) => q.id === firstItem.quoteId
    );

    if (!coreValue || !quote) return;

    try {
      const apiUrl = "/api/post-to-instagram";
      const theme = queueItemThemes.get(firstItem.id) ?? DEFAULT_THEME;

      const content: CarouselContent = {
        quote: {
          text: quote.text,
          author: quote.authorName ?? "Unknown",
        },
        value: {
          name: coreValue.value,
          description: coreValue.description,
        },
      };

      const carousel = await generateCarousel(content, theme);

      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const page1Base64 = await blobToBase64(carousel.page1);
      const page2Base64 = await blobToBase64(carousel.page2);
      const page3Base64 = await blobToBase64(carousel.page3);

      const caption =
        queueItemCaptions.get(firstItem.id) ||
        generateCaption(
          coreValue.value,
          coreValue.description,
          quote.text,
          quote.authorName ?? "Unknown"
        );

      const payload = {
        images: {
          page1: page1Base64,
          page2: page2Base64,
          page3: page3Base64,
        },
        caption,
        metadata: {
          value: coreValue.value,
          valueDescription: coreValue.description,
          quote: quote.text,
          author: quote.authorName ?? "Unknown",
          timestamp: new Date().toISOString(),
        },
        dryRun: true, // Upload only, don't send to Zapier yet
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }

      const result = await response.json();

      // Calculate end time and save to database
      const endTime = Date.now() + 120000; // 2 minutes from now
      const scheduledFor = new Date(endTime);

      // Save to database (singleton pattern with id='current')
      await upsertPendingPost.mutateAsync({
        zapierPayload: JSON.stringify(result.zapierPayload),
        scheduledFor,
      });

      // Activate buffer station
      setBufferPayload(result.zapierPayload);
      setBufferTimeRemaining(120);
      setBufferEndTime(endTime);
      setBufferActive(true);

      // Pop from queue immediately
      popQueue.mutate();
    } catch (error) {
      console.error("Pop and Post failed:", error);
    }
  };

  const handleRotateAndPost = async () => {
    if (!postQueue || postQueue.length === 0) return;

    const firstItem = postQueue[0];
    if (!firstItem) return;

    const coreValue = coreValues?.find(
      (cv: CoreValue) => cv.id === firstItem.coreValueId
    );
    const quote = quotes?.find(
      (q: QuoteWithAuthor) => q.id === firstItem.quoteId
    );

    if (!coreValue || !quote) return;

    try {
      const apiUrl = "/api/post-to-instagram";
      const theme = queueItemThemes.get(firstItem.id) ?? DEFAULT_THEME;

      const content: CarouselContent = {
        quote: {
          text: quote.text,
          author: quote.authorName ?? "Unknown",
        },
        value: {
          name: coreValue.value,
          description: coreValue.description,
        },
      };

      const carousel = await generateCarousel(content, theme);

      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const page1Base64 = await blobToBase64(carousel.page1);
      const page2Base64 = await blobToBase64(carousel.page2);
      const page3Base64 = await blobToBase64(carousel.page3);

      const caption =
        queueItemCaptions.get(firstItem.id) ||
        generateCaption(
          coreValue.value,
          coreValue.description,
          quote.text,
          quote.authorName ?? "Unknown"
        );

      const payload = {
        images: {
          page1: page1Base64,
          page2: page2Base64,
          page3: page3Base64,
        },
        caption,
        metadata: {
          value: coreValue.value,
          valueDescription: coreValue.description,
          quote: quote.text,
          author: quote.authorName ?? "Unknown",
          timestamp: new Date().toISOString(),
        },
        dryRun: true, // Upload only, don't send to Zapier yet
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status}`);
      }

      const result = await response.json();

      // Calculate end time and save to database
      const endTime = Date.now() + 120000; // 2 minutes from now
      const scheduledFor = new Date(endTime);

      // Save to database (singleton pattern with id='current')
      await upsertPendingPost.mutateAsync({
        zapierPayload: JSON.stringify(result.zapierPayload),
        scheduledFor,
      });

      // Activate buffer station
      setBufferPayload(result.zapierPayload);
      setBufferTimeRemaining(120);
      setBufferEndTime(endTime);
      setBufferActive(true);

      // Rotate queue immediately
      rotateQueue.mutate();
    } catch (error) {
      console.error("Rotate and Post failed:", error);
    }
  };

  const handleRandomizeQueueItem = async (postId: string) => {
    const existingImages = queueItemImages.get(postId);
    const currentPost = postQueue?.find((p: PostQueueItem) => p.id === postId);

    const result = await fetchRandomCombination();
    if (result.data && currentPost) {
      const newCoreValueId = result.data.coreValue.id;
      const newQuoteId = result.data.quote!.id;

      // Update the database
      updateQueueItem.mutate({
        id: postId,
        coreValueId: newCoreValueId,
        quoteId: newQuoteId,
      });

      // If images already exist, regenerate with new content immediately
      if (existingImages) {
        // Create updated post object with new IDs
        const updatedPost: PostQueueItem = {
          ...currentPost,
          coreValueId: newCoreValueId,
          quoteId: newQuoteId,
        };
        await handleGenerateQueueItemImages(updatedPost);
      } else {
        // Just clear the caption if no images
        setQueueItemCaptions((prev) => {
          const newMap = new Map(prev);
          newMap.delete(postId);
          return newMap;
        });
      }
    }
  };

  const handleUpdateQueueItemValue = async (
    postId: string,
    coreValueId: string
  ) => {
    const existingImages = queueItemImages.get(postId);
    const currentPost = postQueue?.find((p: PostQueueItem) => p.id === postId);

    if (currentPost) {
      updateQueueItem.mutate({ id: postId, coreValueId });

      // If images already exist, regenerate with new content immediately
      if (existingImages) {
        // Create updated post object with new value ID
        const updatedPost: PostQueueItem = {
          ...currentPost,
          coreValueId,
        };
        await handleGenerateQueueItemImages(updatedPost);
      } else {
        // Just clear the caption if no images
        setQueueItemCaptions((prev) => {
          const newMap = new Map(prev);
          newMap.delete(postId);
          return newMap;
        });
      }
    }
  };

  const handleUpdateQueueItemQuote = async (
    postId: string,
    quoteId: string
  ) => {
    const existingImages = queueItemImages.get(postId);
    const currentPost = postQueue?.find((p: PostQueueItem) => p.id === postId);

    if (currentPost) {
      updateQueueItem.mutate({ id: postId, quoteId });

      // If images already exist, regenerate with new content immediately
      if (existingImages) {
        // Create updated post object with new quote ID
        const updatedPost: PostQueueItem = {
          ...currentPost,
          quoteId,
        };
        await handleGenerateQueueItemImages(updatedPost);
      } else {
        // Just clear the caption if no images
        setQueueItemCaptions((prev) => {
          const newMap = new Map(prev);
          newMap.delete(postId);
          return newMap;
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Buffer Station */}
        {bufferActive && (
          <div className="animate-in slide-in-from-top mb-6 duration-300">
            <Card className="border-indigo-500/50 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
                      <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                        Buffer Station Active
                      </h3>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300">
                        Preparing to post to Instagram
                      </p>
                      {bufferPayload?.metadata && (
                        <div className="mt-2 space-y-1 text-xs text-indigo-600 dark:text-indigo-400">
                          <div className="font-medium">
                            {bufferPayload.metadata.value}
                          </div>
                          <div className="italic">
                            &quot;
                            {bufferPayload.metadata.quote.substring(0, 80)}
                            ...&quot;
                          </div>
                          {bufferPayload.metadata.author &&
                            bufferPayload.metadata.author !== "Unknown" && (
                              <div className="text-indigo-500 dark:text-indigo-500">
                                — {bufferPayload.metadata.author}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-900 tabular-nums dark:text-indigo-100">
                        {Math.floor(bufferTimeRemaining / 60)}:
                        {String(bufferTimeRemaining % 60).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-indigo-700 dark:text-indigo-300">
                        until post
                      </div>
                    </div>
                    <div className="h-12 w-1 overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-800">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
                        style={{
                          height: `${(bufferTimeRemaining / 120) * 100}%`,
                          transition: "height 1s linear",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <BackButton href={`/admin${domainParam}`} />
            <h1
              className="mt-4 mb-2 text-4xl font-bold text-black dark:text-white"
              style={{
                fontFamily: "var(--font-cinzel)",
                letterSpacing: "0.05em",
              }}
            >
              Daily Value Post Automation
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage values, quotes, and automated post generation
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
              {stats?.coreValues ?? 0} Core Values
            </Badge>
            <Badge className="border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300">
              {stats?.supportingValues ?? 0} Supporting Values
            </Badge>
            <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300">
              {stats?.quotes ?? 0} Quotes
            </Badge>
          </div>
        </div>

        {/* Error Banner */}
        {(coreValuesError ||
          supportingValuesError ||
          quotesError ||
          authorsError) && (
          <div className="mb-6 rounded-lg border-2 border-red-500/30 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <h3 className="mb-1 font-semibold text-red-900 dark:text-red-100">
                  Database Connection Error
                </h3>
                <p className="mb-2 text-sm text-red-800 dark:text-red-200">
                  Unable to load data from the database. This usually means the
                  DATABASE_URL environment variable is not configured correctly
                  in production.
                </p>
                <details className="text-xs text-red-700 dark:text-red-300">
                  <summary className="cursor-pointer hover:underline">
                    View technical details
                  </summary>
                  <div className="mt-2 space-y-1 rounded bg-red-900/20 p-2 font-mono">
                    {coreValuesError && (
                      <div>Core Values: {coreValuesError.message}</div>
                    )}
                    {supportingValuesError && (
                      <div>
                        Supporting Values: {supportingValuesError.message}
                      </div>
                    )}
                    {quotesError && <div>Quotes: {quotesError.message}</div>}
                    {authorsError && <div>Authors: {authorsError.message}</div>}
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="core-values"
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Core Values
            </TabsTrigger>
            <TabsTrigger
              value="supporting-values"
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Supporting Values
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <Quote className="h-4 w-4" />
              Quotes & Authors
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Post
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Post Queue
            </TabsTrigger>
          </TabsList>

          {/* Core Values Tab */}
          <TabsContent value="core-values" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Core Values</CardTitle>
                    <CardDescription>
                      Selected values with rich descriptions for Instagram posts
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddCoreValue}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Core Value
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {coreValuesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coreValues?.map((cv: CoreValue) => (
                      <div key={cv.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="mb-1 text-lg font-semibold">
                              {cv.value}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {cv.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleEditCoreValue(
                                  cv.id,
                                  cv.value,
                                  cv.description
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteCoreValue(cv.id, cv.value)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {coreValues?.length === 0 && (
                      <div className="py-8 text-center text-neutral-500">
                        No core values found. Add your first one!
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supporting Values Tab */}
          <TabsContent value="supporting-values" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Supporting Values</CardTitle>
                    <CardDescription>
                      Database of all possible values (Core Values are a subset)
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddSupportingValue}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Supporting Value
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {supportingValuesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supportingValues?.map((sv: SupportingValue) => {
                      const isCore = coreValues?.some(
                        (cv: CoreValue) => cv.value === sv.value
                      );
                      return (
                        <div key={sv.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="mb-1 font-semibold">{sv.value}</h3>
                              {isCore && (
                                <Badge
                                  variant="outline"
                                  className="mt-1 border-indigo-500/30 bg-indigo-500/10 text-xs"
                                >
                                  Used as Core Value
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditSupportingValue(sv.id, sv.value)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteSupportingValue(sv.id, sv.value)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {supportingValues?.length === 0 && (
                      <div className="py-8 text-center text-neutral-500">
                        No supporting values found. Add your first one!
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes & Authors Tab */}
          <TabsContent value="quotes" className="space-y-4">
            {/* Quotes Section - Top */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quotes</CardTitle>
                    <CardDescription>
                      Manage inspirational quotes with author attribution and
                      Core Value associations
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddQuote}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Quote
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quotesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  <div className="max-h-96 space-y-4 overflow-y-auto">
                    {quotes?.map((quote: QuoteWithAuthor) => (
                      <div key={quote.id} className="rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="mb-2 text-sm text-neutral-700 italic dark:text-neutral-300">
                              &ldquo;{quote.text}&rdquo;
                            </p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                              — {quote.authorName ?? "Unknown"}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditQuote(quote)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteQuote(quote.id, quote.text)
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {quotes?.length === 0 && (
                      <div className="py-8 text-center text-neutral-500">
                        No quotes found. Add your first one!
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Authors Section - Bottom (Read-only Summary) */}
            <Card>
              <CardHeader>
                <CardTitle>Authors in Your Arsenal</CardTitle>
                <CardDescription>
                  Summary of all authors and their quote counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {authorsWithCounts?.map((author: AuthorWithCount) => (
                      <div
                        key={author.id}
                        className="rounded-lg border bg-neutral-50 p-3 dark:bg-neutral-900"
                      >
                        <p className="truncate text-sm font-medium">
                          {author.name}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {author.quoteCount}{" "}
                          {author.quoteCount === 1 ? "quote" : "quotes"}
                        </p>
                      </div>
                    ))}
                    {authorsWithCounts?.length === 0 && (
                      <div className="col-span-full py-4 text-center text-sm text-neutral-500">
                        No authors yet. Add a quote with an author to get
                        started!
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Post Tab */}
          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generate Daily Value Post</CardTitle>
                    <CardDescription>
                      Create a 2-page carousel with a core value and inspiring
                      quote
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleRandomize}
                    disabled={isLoadingRandom}
                  >
                    {isLoadingRandom ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Shuffle className="h-4 w-4" />
                    )}
                    Random
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Theme Selector */}
                  <div>
                    <label className="mb-3 block text-sm font-medium">
                      <Palette className="mr-2 inline h-4 w-4" />
                      Theme
                    </label>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                      {Object.values(BRAND_THEMES).map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => handleThemeChange(theme)}
                          className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                            selectedTheme.id === theme.id
                              ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50"
                              : "border-neutral-300 hover:border-[#D4AF37]/50 dark:border-neutral-700"
                          }`}
                        >
                          <div
                            className="h-20 w-full transition-transform group-hover:scale-110"
                            style={{
                              background: theme.backgroundGradient
                                ? `linear-gradient(135deg, ${theme.backgroundGradient.from} 0%, ${theme.backgroundGradient.to} 100%)`
                                : theme.backgroundColor,
                            }}
                          />
                          <div className="border-t border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900">
                            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                              {theme.name}
                            </p>
                          </div>
                          {selectedTheme.id === theme.id && (
                            <div className="absolute top-2 right-2 rounded-full bg-[#D4AF37] p-1">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selection dropdowns */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Core Value
                      </label>
                      <select
                        className="w-full rounded-md border px-3 py-2"
                        value={selectedCoreValueId}
                        onChange={(e) => setSelectedCoreValueId(e.target.value)}
                      >
                        <option value="">Select a value...</option>
                        {coreValues?.map((cv: CoreValue) => (
                          <option key={cv.id} value={cv.id}>
                            {cv.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Quote
                      </label>
                      <select
                        className="w-full rounded-md border px-3 py-2"
                        value={selectedQuoteId}
                        onChange={(e) => setSelectedQuoteId(e.target.value)}
                      >
                        <option value="">Select a quote...</option>
                        {quotes?.map((quote: QuoteWithAuthor) => (
                          <option key={quote.id} value={quote.id}>
                            {quote.authorName ? `${quote.authorName} - ` : ""}
                            {quote.text.substring(0, 50)}
                            {quote.text.length > 50 ? "..." : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preview Area */}
                  {generatedImages &&
                  generatedImages.page1 &&
                  generatedImages.page2 &&
                  generatedImages.page3 ? (
                    <div className="space-y-6">
                      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                        3-Page Carousel Preview
                      </p>
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                          <p className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Page 1: Quote
                          </p>
                          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border-2 border-neutral-300 shadow-lg dark:border-neutral-700">
                            <Image
                              src={generatedImages.page1}
                              alt="Quote Page"
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Page 2: Value + Description
                          </p>
                          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border-2 border-neutral-300 shadow-lg dark:border-neutral-700">
                            <Image
                              src={generatedImages.page2}
                              alt="Value and Description Page"
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
                            Page 3: Call to Action
                          </p>
                          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border-2 border-neutral-300 shadow-lg dark:border-neutral-700">
                            <Image
                              src={generatedImages.page3}
                              alt="Call to Action Page"
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        </div>
                      </div>

                      {/* Caption Preview */}
                      {generatedCaption && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Instagram Caption
                            </label>
                            <span className="text-xs text-neutral-500">
                              {generatedCaption.length} characters
                            </span>
                          </div>
                          <textarea
                            className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                            rows={10}
                            value={generatedCaption}
                            onChange={(e) =>
                              setGeneratedCaption(e.target.value)
                            }
                            placeholder="Caption will appear here..."
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed p-8 text-center">
                      <Sparkles className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Select a value and quote, then click Generate to preview
                        the carousel
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleGenerate}
                      disabled={
                        !selectedCoreValueId || !selectedQuoteId || isGenerating
                      }
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                    {generatedImages && (
                      <Button
                        className="flex items-center gap-2"
                        onClick={handlePost}
                      >
                        <Send className="h-4 w-4" />
                        Post to Instagram
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Post Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Post Queue</CardTitle>
                    <CardDescription>
                      Manage the queue of posts for daily automation (Max 10)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to clear the entire queue? This cannot be undone."
                          )
                        ) {
                          clearQueue.mutate();
                        }
                      }}
                      disabled={
                        !postQueue ||
                        postQueue.length === 0 ||
                        clearQueue.isPending
                      }
                      className="flex items-center gap-2"
                    >
                      {clearQueue.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <XIcon className="h-3 w-3" />
                      )}
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => popQueue.mutate()}
                      disabled={
                        !postQueue ||
                        postQueue.length === 0 ||
                        popQueue.isPending
                      }
                      className="flex items-center gap-2"
                    >
                      {popQueue.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ChevronDown className="h-3 w-3 rotate-180" />
                      )}
                      Pop
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => enqueuePost.mutate()}
                      disabled={
                        !postQueue ||
                        postQueue.length >= 10 ||
                        enqueuePost.isPending
                      }
                      className="flex items-center gap-2"
                    >
                      {enqueuePost.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      Enqueue
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateQueue.mutate()}
                      disabled={
                        !postQueue ||
                        postQueue.length === 0 ||
                        rotateQueue.isPending
                      }
                      className="flex items-center gap-2"
                    >
                      {rotateQueue.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Repeat className="h-3 w-3" />
                      )}
                      Rotate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePopAndPost}
                      disabled={!postQueue || postQueue.length === 0}
                      className="flex items-center gap-2 border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10"
                    >
                      <Send className="h-3 w-3" />
                      Pop & Post
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRotateAndPost}
                      disabled={!postQueue || postQueue.length === 0}
                      className="flex items-center gap-2 border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10"
                    >
                      <Send className="h-3 w-3" />
                      Rotate & Post
                    </Button>
                    <Button
                      onClick={() => fillQueue.mutate()}
                      disabled={
                        !postQueue ||
                        postQueue.length >= 10 ||
                        fillQueue.isPending
                      }
                      className="flex items-center gap-2"
                    >
                      {fillQueue.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Fill Queue
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {queueLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {postQueue?.map((post: PostQueueItem, index: number) => {
                      const coreValue = coreValues?.find(
                        (cv: CoreValue) => cv.id === post.coreValueId
                      );
                      const quote = quotes?.find(
                        (q: QuoteWithAuthor) => q.id === post.quoteId
                      );
                      const isExpanded = expandedQueueItems.has(post.id);
                      const images = queueItemImages.get(post.id);
                      const theme =
                        queueItemThemes.get(post.id) ?? DEFAULT_THEME;
                      const caption = queueItemCaptions.get(post.id);

                      return (
                        <div
                          key={post.id}
                          className={`rounded-lg border p-4 ${
                            index === 0
                              ? "border-2 border-indigo-500/30 bg-indigo-500/5"
                              : ""
                          }`}
                        >
                          {/* Simplified View */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <Badge
                                  className={
                                    index === 0
                                      ? "bg-indigo-500 text-white"
                                      : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                                  }
                                >
                                  #{post.queuePosition ?? index + 1}
                                  {index === 0 ? " - Next" : ""}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                >
                                  <Palette className="mr-1 h-3 w-3" />
                                  {theme.name}
                                </Badge>
                              </div>
                              <p className="mb-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {coreValue?.value ?? "Unknown Value"}
                              </p>
                              <p className="text-sm text-neutral-600 italic dark:text-neutral-400">
                                &quot;{quote?.text.substring(0, 100)}
                                {quote && quote.text.length > 100 ? "..." : ""}
                                &quot;
                                {quote?.authorName &&
                                  quote.authorName.toLowerCase() !==
                                    "unknown" && (
                                    <span className="ml-1 text-xs text-neutral-500 not-italic dark:text-neutral-500">
                                      — {quote.authorName}
                                    </span>
                                  )}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRandomizeQueueItem(post.id)
                                }
                                title="Randomize value and quote"
                              >
                                <Shuffle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleQueueItemExpanded(post.id)}
                              >
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteQueueItem(post.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>

                          {/* Expanded View */}
                          {isExpanded && (
                            <div className="mt-4 space-y-4 border-t pt-4">
                              {/* Value & Quote Selection */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-medium">
                                    Content
                                  </Label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRandomizeQueueItem(post.id)
                                    }
                                    className="h-7 gap-1 text-xs"
                                  >
                                    <Shuffle className="h-3 w-3" />
                                    Randomize
                                  </Button>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                  {/* Value Selector */}
                                  <div>
                                    <Label className="mb-1.5 block text-xs text-neutral-600 dark:text-neutral-400">
                                      Core Value
                                    </Label>
                                    <select
                                      value={post.coreValueId}
                                      onChange={(e) =>
                                        handleUpdateQueueItemValue(
                                          post.id,
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                    >
                                      {coreValues?.map((cv: CoreValue) => (
                                        <option key={cv.id} value={cv.id}>
                                          {cv.value}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Quote Selector */}
                                  <div>
                                    <Label className="mb-1.5 block text-xs text-neutral-600 dark:text-neutral-400">
                                      Quote
                                    </Label>
                                    <select
                                      value={post.quoteId}
                                      onChange={(e) =>
                                        handleUpdateQueueItemQuote(
                                          post.id,
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                                    >
                                      {quotes?.map((q: QuoteWithAuthor) => (
                                        <option key={q.id} value={q.id}>
                                          {q.text.substring(0, 60)}
                                          {q.text.length > 60 ? "..." : ""}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Theme Selector */}
                              <div>
                                <Label className="mb-2 block text-xs font-medium">
                                  Theme
                                </Label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                  {Object.entries(BRAND_THEMES).map(
                                    ([key, t]) => (
                                      <button
                                        key={key}
                                        onClick={() =>
                                          handleQueueItemThemeChange(post.id, t)
                                        }
                                        className={`rounded-lg border p-3 text-left transition-all hover:border-neutral-400 ${
                                          theme.name === t.name
                                            ? "border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20"
                                            : "border-neutral-200 dark:border-neutral-700"
                                        }`}
                                      >
                                        <div
                                          className="mb-2 h-6 w-full rounded"
                                          style={{
                                            background: t.backgroundGradient
                                              ? `linear-gradient(135deg, ${t.backgroundGradient.from} 0%, ${t.backgroundGradient.to} 100%)`
                                              : `linear-gradient(135deg, ${t.backgroundColor} 0%, ${t.accentColor} 100%)`,
                                          }}
                                        />
                                        <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                                          {t.name}
                                        </p>
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Generate/Regenerate Button */}
                              <div className="flex justify-center">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleGenerateQueueItemImages(post)
                                  }
                                  disabled={generatingQueueItems.has(post.id)}
                                  className="flex items-center gap-2"
                                >
                                  {generatingQueueItems.has(post.id) ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="h-4 w-4" />
                                      {images
                                        ? "Regenerate Images"
                                        : "Generate Images"}
                                    </>
                                  )}
                                </Button>
                              </div>

                              {/* Images Display */}
                              {images &&
                                images.page1 &&
                                images.page2 &&
                                images.page3 && (
                                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="rounded-lg border p-2 dark:border-neutral-700">
                                      <p className="mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                        Page 1
                                      </p>
                                      <Image
                                        src={images.page1}
                                        alt="Page 1"
                                        width={400}
                                        height={400}
                                        className="w-full rounded"
                                        unoptimized
                                      />
                                    </div>
                                    <div className="rounded-lg border p-2 dark:border-neutral-700">
                                      <p className="mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                        Page 2
                                      </p>
                                      <Image
                                        src={images.page2}
                                        alt="Page 2"
                                        width={400}
                                        height={400}
                                        className="w-full rounded"
                                        unoptimized
                                      />
                                    </div>
                                    <div className="rounded-lg border p-2 dark:border-neutral-700">
                                      <p className="mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                                        Page 3
                                      </p>
                                      <Image
                                        src={images.page3}
                                        alt="Page 3"
                                        width={400}
                                        height={400}
                                        className="w-full rounded"
                                        unoptimized
                                      />
                                    </div>
                                  </div>
                                )}

                              {/* Caption Preview */}
                              {caption && (
                                <div className="rounded-lg border bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
                                  <p className="mb-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                    Instagram Caption
                                  </p>
                                  <p className="text-xs whitespace-pre-wrap text-neutral-600 dark:text-neutral-400">
                                    {caption}
                                  </p>
                                </div>
                              )}

                              {/* Metadata */}
                              <div className="space-y-2 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900">
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                  <span className="font-medium">Value:</span>{" "}
                                  {coreValue?.value}
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                  <span className="font-medium">Quote:</span>{" "}
                                  &quot;
                                  {quote?.text}&quot;
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                  <span className="font-medium">Author:</span>{" "}
                                  {quote?.authorName ?? "Unknown"}
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                  <span className="font-medium">Created:</span>{" "}
                                  {new Date(post.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {postQueue?.length === 0 && (
                      <div className="py-8 text-center text-neutral-500">
                        No posts in queue. Click &ldquo;Fill Queue&rdquo; to
                        generate posts.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Supporting Value Dialog */}
      <Dialog
        open={supportingValueDialog.open}
        onOpenChange={(open) =>
          setSupportingValueDialog({ ...supportingValueDialog, open })
        }
      >
        <DialogContent>
          <DialogClose
            onClick={() =>
              setSupportingValueDialog({
                ...supportingValueDialog,
                open: false,
              })
            }
          />
          <DialogHeader>
            <DialogTitle>
              {supportingValueDialog.mode === "add" ? "Add" : "Edit"} Supporting
              Value
            </DialogTitle>
            <DialogDescription>
              {supportingValueDialog.mode === "add"
                ? "Add a new value to your database."
                : "Update the value name."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sv-value">Value Name</Label>
              <Input
                id="sv-value"
                value={supportingValueForm.value}
                onChange={(e) =>
                  setSupportingValueForm({ value: e.target.value })
                }
                placeholder="e.g., Gratitude, Courage, Compassion"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setSupportingValueDialog({
                  ...supportingValueDialog,
                  open: false,
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSupportingValueSubmit}
              disabled={
                !supportingValueForm.value.trim() ||
                createSupportingValue.isPending ||
                updateSupportingValue.isPending
              }
            >
              {createSupportingValue.isPending ||
              updateSupportingValue.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : supportingValueDialog.mode === "add" ? (
                "Add"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Core Value Dialog */}
      <Dialog
        open={coreValueDialog.open}
        onOpenChange={(open) =>
          setCoreValueDialog({ ...coreValueDialog, open })
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogClose
            onClick={() =>
              setCoreValueDialog({ ...coreValueDialog, open: false })
            }
          />
          <DialogHeader>
            <DialogTitle>
              {coreValueDialog.mode === "add" ? "Add" : "Edit"} Core Value
            </DialogTitle>
            <DialogDescription>
              {coreValueDialog.mode === "add"
                ? "Select from existing values or create a new one."
                : "Update the description for this core value."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {coreValueDialog.mode === "add" && (
              <>
                <div className="flex gap-4">
                  <Button
                    variant={
                      coreValueForm.inputMode === "dropdown"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setCoreValueForm({
                        ...coreValueForm,
                        inputMode: "dropdown",
                      })
                    }
                  >
                    Select from List
                  </Button>
                  <Button
                    variant={
                      coreValueForm.inputMode === "manual"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setCoreValueForm({
                        ...coreValueForm,
                        inputMode: "manual",
                      })
                    }
                  >
                    Create New
                  </Button>
                </div>

                {coreValueForm.inputMode === "dropdown" ? (
                  <div>
                    <Label htmlFor="cv-dropdown">Select Value</Label>
                    <select
                      id="cv-dropdown"
                      className="w-full rounded-md border px-3 py-2"
                      value={coreValueForm.supportingValueId}
                      onChange={(e) =>
                        setCoreValueForm({
                          ...coreValueForm,
                          supportingValueId: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose a value...</option>
                      {availableSupportingValues?.map((sv: SupportingValue) => (
                        <option key={sv.id} value={sv.id}>
                          {sv.value}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="cv-manual">Value Name</Label>
                    <Input
                      id="cv-manual"
                      value={coreValueForm.manualValue}
                      onChange={(e) =>
                        setCoreValueForm({
                          ...coreValueForm,
                          manualValue: e.target.value,
                        })
                      }
                      placeholder="e.g., Authenticity"
                    />
                  </div>
                )}
              </>
            )}

            {coreValueDialog.mode === "edit" && (
              <div>
                <Label>Value Name</Label>
                <p className="mt-1 text-sm text-neutral-600">
                  {coreValueForm.manualValue}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Value names cannot be edited. Create a new Core Value instead.
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="cv-description">Description</Label>
              <Textarea
                id="cv-description"
                value={coreValueForm.description}
                onChange={(e) =>
                  setCoreValueForm({
                    ...coreValueForm,
                    description: e.target.value,
                  })
                }
                placeholder="Write a compelling description that will inspire and resonate with your audience..."
                rows={5}
              />
              <p className="mt-1 text-xs text-neutral-500">
                This description will appear on your Instagram post. Make it
                impactful!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setCoreValueDialog({ ...coreValueDialog, open: false })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleCoreValueSubmit}
              disabled={
                !coreValueForm.description.trim() ||
                (coreValueDialog.mode === "add" &&
                  coreValueForm.inputMode === "dropdown" &&
                  !coreValueForm.supportingValueId) ||
                (coreValueDialog.mode === "add" &&
                  coreValueForm.inputMode === "manual" &&
                  !coreValueForm.manualValue.trim()) ||
                createCoreValue.isPending ||
                updateCoreValue.isPending
              }
            >
              {createCoreValue.isPending || updateCoreValue.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : coreValueDialog.mode === "add" ? (
                "Add"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Author Dialog */}
      <Dialog
        open={authorDialog.open}
        onOpenChange={(open) => setAuthorDialog({ ...authorDialog, open })}
      >
        <DialogContent>
          <DialogClose
            onClick={() => setAuthorDialog({ ...authorDialog, open: false })}
          />
          <DialogHeader>
            <DialogTitle>
              {authorDialog.mode === "add" ? "Add" : "Edit"} Author
            </DialogTitle>
            <DialogDescription>
              {authorDialog.mode === "add"
                ? "Add a new author."
                : "Update the author name."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="author-name">Author Name</Label>
              <Input
                id="author-name"
                value={authorForm.name}
                onChange={(e) => setAuthorForm({ name: e.target.value })}
                placeholder="e.g., Marcus Aurelius"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAuthorDialog({ ...authorDialog, open: false })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAuthorSubmit}
              disabled={
                !authorForm.name.trim() ||
                createAuthor.isPending ||
                updateAuthor.isPending
              }
            >
              {createAuthor.isPending || updateAuthor.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : authorDialog.mode === "add" ? (
                "Add"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quote Dialog */}
      <Dialog
        open={quoteDialog.open}
        onOpenChange={(open) => setQuoteDialog({ ...quoteDialog, open })}
      >
        <DialogContent className="max-w-2xl">
          <DialogClose
            onClick={() => setQuoteDialog({ ...quoteDialog, open: false })}
          />
          <DialogHeader>
            <DialogTitle>
              {quoteDialog.mode === "add" ? "Add" : "Edit"} Quote
            </DialogTitle>
            <DialogDescription>
              {quoteDialog.mode === "add"
                ? "Add a new inspirational quote."
                : "Update the quote details."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quote-text">Quote Text</Label>
              <Textarea
                id="quote-text"
                value={quoteForm.text}
                onChange={(e) =>
                  setQuoteForm({ ...quoteForm, text: e.target.value })
                }
                placeholder="Enter the quote..."
                rows={4}
              />
            </div>
            {/* Author Selection with Inline Add */}
            <div className="space-y-2">
              <Label htmlFor="quote-author">Author</Label>
              <select
                id="quote-author"
                className="w-full rounded-md border px-3 py-2"
                value={quoteForm.authorId}
                onChange={(e) =>
                  setQuoteForm({
                    ...quoteForm,
                    authorId: e.target.value,
                    newAuthorName: "",
                  })
                }
              >
                <option value="NEW_AUTHOR">➕ Add New Author</option>
                <option value="">-- or Select Existing --</option>
                {authors?.map((author: Author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>

              {/* Inline New Author Input */}
              {quoteForm.authorId === "NEW_AUTHOR" && (
                <div className="space-y-1">
                  <div className="relative">
                    <Input
                      value={quoteForm.newAuthorName}
                      onChange={(e) =>
                        setQuoteForm({
                          ...quoteForm,
                          newAuthorName: e.target.value,
                        })
                      }
                      placeholder="Enter new author name..."
                      className={
                        quoteForm.newAuthorName.trim() &&
                        authors?.some(
                          (a: Author) =>
                            a.name.toLowerCase() ===
                            quoteForm.newAuthorName.trim().toLowerCase()
                        )
                          ? "border-red-500 pr-8"
                          : quoteForm.newAuthorName.trim()
                            ? "border-green-500 pr-8"
                            : "pr-8"
                      }
                    />
                    {quoteForm.newAuthorName.trim() && (
                      <div className="absolute top-1/2 right-2 -translate-y-1/2">
                        {authors?.some(
                          (a: Author) =>
                            a.name.toLowerCase() ===
                            quoteForm.newAuthorName.trim().toLowerCase()
                        ) ? (
                          <XIcon className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {quoteForm.newAuthorName.trim() &&
                    authors?.some(
                      (a: Author) =>
                        a.name.toLowerCase() ===
                        quoteForm.newAuthorName.trim().toLowerCase()
                    ) && (
                      <p className="text-xs text-red-600">
                        This author already exists. Please select them from the
                        dropdown.
                      </p>
                    )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quote-source">Source (Optional)</Label>
                <Input
                  id="quote-source"
                  value={quoteForm.source}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, source: e.target.value })
                  }
                  placeholder="e.g., Meditations"
                />
              </div>
              <div>
                <Label htmlFor="quote-category">Category (Optional)</Label>
                <Input
                  id="quote-category"
                  value={quoteForm.category}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, category: e.target.value })
                  }
                  placeholder="e.g., Philosophy"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="quote-tags">
                Tags (Optional, comma-separated)
              </Label>
              <Input
                id="quote-tags"
                value={quoteForm.tags}
                onChange={(e) =>
                  setQuoteForm({ ...quoteForm, tags: e.target.value })
                }
                placeholder="e.g., wisdom, stoicism, mindfulness"
              />
            </div>

            {/* Expandable Core Values Section */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  setQuoteForm({
                    ...quoteForm,
                    coreValuesExpanded: !quoteForm.coreValuesExpanded,
                  })
                }
                className="flex w-full items-center justify-between rounded-md border p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${quoteForm.coreValuesExpanded ? "rotate-180" : ""}`}
                  />
                  <span className="text-sm font-medium">Core Values</span>
                  <Badge variant="outline" className="text-xs">
                    {quoteForm.coreValueIds.length}/{coreValues?.length ?? 0}
                  </Badge>
                </div>
                <span className="text-xs text-neutral-500">
                  {quoteForm.coreValuesExpanded
                    ? "Click to collapse"
                    : "Click to expand"}
                </span>
              </button>

              {quoteForm.coreValuesExpanded && (
                <div className="rounded-md border p-4">
                  <p className="mb-3 text-xs text-neutral-600 dark:text-neutral-400">
                    Select which Core Values this quote relates to
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {coreValues?.map((cv: CoreValue) => (
                      <label
                        key={cv.id}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={quoteForm.coreValueIds.includes(cv.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setQuoteForm({
                                ...quoteForm,
                                coreValueIds: [
                                  ...quoteForm.coreValueIds,
                                  cv.id,
                                ],
                              });
                            } else {
                              setQuoteForm({
                                ...quoteForm,
                                coreValueIds: quoteForm.coreValueIds.filter(
                                  (id) => id !== cv.id
                                ),
                              });
                            }
                          }}
                          className="rounded border-neutral-300"
                        />
                        <span className="text-sm">{cv.value}</span>
                      </label>
                    ))}
                  </div>
                  {coreValues?.length === 0 && (
                    <p className="text-center text-sm text-neutral-500">
                      No Core Values available. Add some first!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setQuoteDialog({ ...quoteDialog, open: false })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuoteSubmit}
              disabled={
                !quoteForm.text.trim() ||
                (quoteForm.authorId === "NEW_AUTHOR" &&
                  !quoteForm.newAuthorName.trim()) ||
                (quoteForm.authorId === "NEW_AUTHOR" &&
                  authors?.some(
                    (a: Author) =>
                      a.name.toLowerCase() ===
                      quoteForm.newAuthorName.trim().toLowerCase()
                  )) ||
                createQuote.isPending ||
                updateQuote.isPending ||
                updateQuoteCoreValues.isPending
              }
            >
              {createQuote.isPending || updateQuote.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : quoteDialog.mode === "add" ? (
                "Add"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.open}
        onOpenChange={(open) =>
          setDeleteConfirmDialog({ ...deleteConfirmDialog, open })
        }
      >
        <DialogContent>
          <DialogClose
            onClick={() =>
              setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })
            }
          />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              {deleteConfirmDialog.requiresConfirmation &&
              deleteConfirmDialog.message ? (
                <div className="space-y-2">
                  <p>{deleteConfirmDialog.message}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    This action cannot be undone.
                  </p>
                </div>
              ) : (
                <>
                  Are you sure you want to delete{" "}
                  <strong>{deleteConfirmDialog.name}</strong>? This action
                  cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmDialog({ ...deleteConfirmDialog, open: false })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={
                deleteSupportingValue.isPending ||
                confirmDeleteSupportingValue.isPending ||
                deleteCoreValue.isPending ||
                deleteAuthor.isPending ||
                deleteQuote.isPending
              }
            >
              {deleteSupportingValue.isPending ||
              confirmDeleteSupportingValue.isPending ||
              deleteCoreValue.isPending ||
              deleteAuthor.isPending ||
              deleteQuote.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DailyValuesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <DailyValuesContent />
    </Suspense>
  );
}
