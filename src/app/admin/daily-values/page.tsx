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

      alert("✅ Post sent to Zapier successfully!");
    } catch (error) {
      console.error("Error posting to Zapier:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`❌ Failed to post to Zapier\n\n${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black">
      <div className="container mx-auto px-4 py-8">
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
                  {generatedImages ? (
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
                      Manage the queue of posts for daily automation
                    </CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Fill Queue
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {queueLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {postQueue?.map((post: PostQueueItem, index: number) => (
                      <div
                        key={post.id}
                        className={`rounded-lg border p-4 ${
                          index === 0
                            ? "border-2 border-indigo-500/30 bg-indigo-500/5"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <Badge
                                className={
                                  index === 0
                                    ? "bg-indigo-500 text-white"
                                    : "bg-neutral-200 text-neutral-700"
                                }
                              >
                                Position {post.queuePosition ?? index + 1}
                                {index === 0 ? " - Next" : ""}
                              </Badge>
                              {post.scheduledFor && (
                                <Badge variant="outline" className="text-xs">
                                  Scheduled:{" "}
                                  {new Date(
                                    post.scheduledFor
                                  ).toLocaleDateString()}
                                </Badge>
                              )}
                              {post.isPublished === "true" && (
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 text-green-700"
                                >
                                  Published
                                </Badge>
                              )}
                            </div>
                            <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                              Post ID: {post.id.substring(0, 8)}...
                            </p>
                            {post.caption && (
                              <p className="text-sm text-neutral-600 italic dark:text-neutral-400">
                                {post.caption.substring(0, 100)}
                                {post.caption.length > 100 ? "..." : ""}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
