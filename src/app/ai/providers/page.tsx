"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { getUser, updateAiProviders } from "@/modules/user.module";
import { validateProvider } from "@/modules/ai.provider.module";

import LoadingScreen from "@/components/screens/loading-screen";
import AiLayout from "@/components/ai/layout";
import Card from "@/components/ui/card";
import MainButton from "@/components/ui/buttons/main";
import HazardButton from "@/components/ui/buttons/hazard";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import OptionsInput from "@/components/forms/options-input";
import SnackBar from "@/components/ui/snackbar";

import type { UserData } from "@/types/user.types";
import { providers, providersArray } from "@/utils/getURL";
import {
  IconCloudQuestion,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";

const PROVIDER_DISPLAY_NAMES = providersArray.map(
  (key) => providers[key as keyof typeof providers].name
);

const KEY_BY_DISPLAY: Record<string, string> = {};
providersArray.forEach((key) => {
  KEY_BY_DISPLAY[providers[key as keyof typeof providers].name] = key;
});

const NEEDS_CUSTOM_URL = new Set(["ollama", "other"]);
const NEEDS_API_KEY = new Set(
  providersArray.filter((k) => !NEEDS_CUSTOM_URL.has(k))
);

export default function AiProvidersPage() {
  const router = useRouter();
  const snackbarRef = useRef(null);

  const [user, setUser] = useState<UserData>();
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [selectedDisplayName, setSelectedDisplayName] = useState(
    PROVIDER_DISPLAY_NAMES[0]
  );
  const [apiKey, setApiKey] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const selectedKey = KEY_BY_DISPLAY[selectedDisplayName] ?? "";
  const requiresApiKey = NEEDS_API_KEY.has(selectedKey);
  const requiresCustomUrl = NEEDS_CUSTOM_URL.has(selectedKey);

  const canSubmit =
    !isConnecting &&
    selectedKey !== "" &&
    (!requiresApiKey || apiKey.trim().length > 0) &&
    (!requiresCustomUrl || customUrl.trim().length > 0);

  const disabledMessage = requiresApiKey
    ? "API key required"
    : requiresCustomUrl
      ? "Custom URL required"
      : undefined;

  useEffect(() => {
    const get = async () => {
      const data = await getUser(router);
      if (!data) return;
      setUser(data);
    };
    get();
  }, [router]);

  // Reset form when modal opens
  const openModal = () => {
    setSelectedDisplayName(PROVIDER_DISPLAY_NAMES[0]);
    setApiKey("");
    setCustomUrl("");
    setShowModal(true);
  };

  const handleConnect = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!canSubmit || !user) return;

    setIsConnecting(true);

    const result = await validateProvider(
      selectedKey,
      apiKey,
      requiresCustomUrl ? customUrl : undefined,
      snackbarRef
    );

    if (!result.success || !result.models) {
      setIsConnecting(false);
      return;
    }

    const newProvider = {
      name: selectedKey,
      api_key: apiKey,
      models: result.models,
      ...(requiresCustomUrl && customUrl ? { url: customUrl } : {}),
    };

    const existing = user.ai ?? [];
    const withoutDuplicate = existing.filter((p) => p.name !== selectedKey);
    const updated = [...withoutDuplicate, newProvider];

    setShowModal(false);

    const saved = await updateAiProviders(router, updated, snackbarRef);

    if (saved) {
      const refreshed = await getUser(router);
      if (refreshed) setUser(refreshed);
    }

    setIsConnecting(false);
  };

  const handleDelete = async (providerName: string) => {
    if (!user) return;

    const updated = (user.ai ?? []).filter((p) => p.name !== providerName);
    const saved = await updateAiProviders(router, updated, snackbarRef);

    if (saved) {
      const refreshed = await getUser(router);
      if (refreshed) setUser(refreshed);
    }
  };

  if (!user) return <LoadingScreen />;

  return (
    <AiLayout user={user} router={router}>
      <SnackBar ref={snackbarRef} />

      <main className="w-full flex flex-col items-center justify-start p-5 py-10 gap-8">
        <div className="w-full flex items-center justify-between max-w-5xl">
          <p className="text-4xl font-medium tracking-wide">
            Set your providers
          </p>

          <MainButton size="w-auto px-4" action={openModal}>
            <IconPlus size={18} />
          </MainButton>
        </div>

        {/* Providers list */}
        <div className="w-full flex flex-col items-center justify-start gap-4 max-w-5xl">
          {user.ai && user.ai.length > 0 ? (
            user.ai.map((provider) => (
              <Card
                key={provider.name}
                title={
                  providers[provider.name as keyof typeof providers]?.name ??
                  provider.name
                }
              >
                <div className="w-full flex flex-col gap-1">
                  <p className="text-sm text-neutral-500">
                    {provider.name in providers
                      ? providers[provider.name as keyof typeof providers].url
                      : provider.url || "Custom URL"}
                  </p>

                  <p className="text-sm text-neutral-400 mt-2">
                    {provider.models.length} model
                    {provider.models.length !== 1 ? "s" : ""}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {provider.models.map((model) => (
                      <span
                        key={model + provider.name}
                        className="text-xs bg-neutral-800 px-2 py-0.5 rounded-sm">
                        {model}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3">
                    <HazardButton
                      size="w-auto px-3 py-1"
                      action={() => handleDelete(provider.name)}>
                      <IconTrash size={14} />
                    </HazardButton>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <section className="w-full flex flex-col items-center justify-center gap-1 text-neutral-400 py-20">
              <IconCloudQuestion size={120} stroke={0.8} />

              <p className="text-4xl mb-5 font-light">
                No providers connected
              </p>

              <MainButton size="w-30" action={openModal}>
                Connect one
              </MainButton>
            </section>
          )}
        </div>

        {/* Modal overlay */}
        {showModal && (
          <div
            className="w-screen h-screen flex items-center justify-center p-10 z-10 backdrop-blur backdrop-brightness-75 fixed top-0 left-0"
            onClick={() => setShowModal(false)}>
            <div onClick={(e) => e.stopPropagation()}>
              <CreatorForm
                title="Connect a new provider"
                action={handleConnect}
                hideAction={() => setShowModal(false)}
                actionIsDisabled={!canSubmit}
                confirmMessage={isConnecting ? "Connecting..." : "Connect"}
                disabledMessage={disabledMessage}>
                <OptionsInput
                  label="Provider"
                  value={selectedDisplayName}
                  onChange={setSelectedDisplayName}
                  options={PROVIDER_DISPLAY_NAMES}
                  isRequired
                />

                {requiresApiKey && (
                  <CreatorInput
                    label="API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    required
                  />
                )}

                {requiresCustomUrl && (
                  <CreatorInput
                    label="Custom URL"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="http://localhost:11434"
                    type="url"
                    required
                  />
                )}
              </CreatorForm>
            </div>
          </div>
        )}
      </main>
    </AiLayout>
  );
}
