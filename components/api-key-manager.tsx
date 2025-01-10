"use client";

import { useState } from "react";

import { useApiKeys } from "@/contexts/api-key-context";
import { LLMProvider } from "@/types/llm";
import { PROVIDERS } from "@/constants/models";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { Eye, EyeOff, Save, Trash2 } from "lucide-react";

export const ProviderKeyManager = () => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { setApiKey, getApiKey, removeApiKey, hasApiKey } = useApiKeys();

  const toggleShowKey = (provider: LLMProvider) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSave = (provider: LLMProvider, inputValue: string) => {
    if (inputValue.trim()) {
      setApiKey(provider, inputValue);
      toast({
        title: "API Key Saved",
        description: `Your API Key for ${PROVIDERS[provider].displayName} has been saved to Local Storage.`,
      });
    }
  };

  const handleDelete = (provider: LLMProvider) => {
    removeApiKey(provider);
    setShowKeys((prev) => ({ ...prev, [provider]: false }));
    setInputValues((prev) => ({ ...prev, [provider]: "" }));

    toast({
      title: "API Key Deleted",
      description: `Your API Key for ${PROVIDERS[provider].displayName} has been deleted from Local Storage.`,
    });
  };

  return (
    <div className="space-y-2 mb-4">
      {(Object.keys(PROVIDERS) as LLMProvider[]).map((provider) => {
        const providerInfo = PROVIDERS[provider];
        const Icon = providerInfo.icon;

        const storedKey = hasApiKey(provider) ? getApiKey(provider)?.key : "";
        const currentInput = inputValues[provider] ?? storedKey;

        const hasKey = hasApiKey(provider);
        const showKey = showKeys[provider] ?? false;

        const isNonEmpty = currentInput.trim().length > 0;
        const isChanged = currentInput !== storedKey;
        const canSave = isNonEmpty && isChanged;

        return (
          <div key={provider} className="space-y-2">
            <Label htmlFor={`${provider}-api-key`} className="text-sm font-semibold">
              {providerInfo.displayName}
            </Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Input
                  id={`${provider}-api-key`}
                  type={showKey ? "text" : "password"}
                  placeholder={`Enter ${providerInfo.displayName} API Key`}
                  value={currentInput}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setInputValues((prev) => ({
                      ...prev,
                      [provider]: newValue,
                    }));
                  }}
                  className="pr-8"
                  // className={`pr-10 ${isSaved ? 'border-green-500': ''}`} Setup functionality to register save here instead of a toast?
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey(provider)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {/* Delete Button */}
              <Button
                onClick={() => handleDelete(provider)}
                variant="outline"
                size="icon"
                disabled={!hasKey}
              >
                <Trash2 className="size-4" />
              </Button>
              {/* Save Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSave(provider, currentInput)}
                disabled={!canSave}
                className="flex-shrink-0"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
