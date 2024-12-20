"use client";

import { useState } from "react";
import { useApiKeys } from "@/hooks/use-api-key";
import { useModels } from "@/hooks/use-models";
import { apiKeySchema, type ApiKeyFormData } from "@/types/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LLMProviders } from "@/types/llm";

export const ApiKeyForm = () => {
  const { addApiKey } = useApiKeys();
  const { configureHostedModels } = useModels();
  const form = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      provider: "openai",
      name: "",
      apiKey: "",
    },
  });

  const onSubmit = (data: ApiKeyFormData) => {
    const apiKeyId = addApiKey({
      name: data.name || `${data.provider} Key`,
      key: data.apiKey,
      provider: data.provider,
    });

    if (data.provider !== "custom") {
      configureHostedModels(apiKeyId, data.provider);
    }

    form.reset();
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add API Key</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {LLMProviders.map((provider) => (
                        <SelectItem
                          key={provider}
                          value={provider}
                          className="capitalize"
                        >
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`${form.watch("provider")} Key`}
                      {...field}
                      className="capitalize"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your API key"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Add API Key
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
