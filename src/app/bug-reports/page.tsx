"use client";

import { useState } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SmoothProvider from "@/lib/components/lennis";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";

export default function BugReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    steps: "",
    version: "",
    error_date: "",
    email: "",
    screenshot_url: "",
  });

  const handleChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/bug-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Error al reportar el bug");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("¡Bug reportado exitosamente! Gracias por tu ayuda.");
      setFormData({
        title: "",
        description: "",
        steps: "",
        version: "",
        error_date: "",
        email: "",
        screenshot_url: "",
      });
      setShowForm(false);

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      setErrorMessage("Error de conexión. Intenta de nuevo.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-zinc-50 min-h-screen grid grid-rows-[auto_1fr_auto]">
      <Header />

      <main className="flex flex-col justify-start items-center py-10 px-4">
        <SmoothProvider />

        <section className="flex flex-col justify-center items-center relative animate-fade-in-up overflow-hidden w-full text-text min-h-80 max-w-4xl">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-200 bg-main/40 blur-3xl rounded-full animate-pulse" />
          </div>

          <div className="z-2 text-center">
            <h1 className="text-5xl font-bold mb-4">Reportar un Bug</h1>
            <p className="opacity-80 max-w-2xl">
              ¿Encontraste un problema? Ayúdanos a mejorar Prismaflow reportando los bugs
              que encuentres. Tu retroalimentación es fundamental.
            </p>
          </div>
        </section>

        <section className="w-full max-w-2xl mt-12 z-2">
          {successMessage && (
            <div className="mb-6 px-4 py-3 bg-green-900/30 border border-green-600 rounded-lg text-green-400 animate-fade-in-up">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 px-4 py-3 bg-red-900/30 border border-red-600 rounded-lg text-red-400 animate-fade-in-up">
              {errorMessage}
            </div>
          )}

          {!showForm ? (
            <div className="flex justify-center">
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 rounded-md text-zinc-50 bg-main duration-400 hover:bg-main/80 active:bg-main/80 active:scale-95 min-w-40 font-medium tracking-wide"
              >
                Reportar un Bug
              </button>
            </div>
          ) : (
            <CreatorForm
              title="Nuevo Reporte de Bug"
              action={handleSubmit}
              hideAction={() => setShowForm(false)}
              actionIsDisabled={isLoading}
              confirmMessage={isLoading ? "Enviando..." : "Reportar"}
            >
              <CreatorInput
                label="Título"
                placeholder="e.g. El formulario de login no funciona"
                value={formData.title}
                onChange={handleChange("title")}
                required
              />

              <CreatorInput
                label="Descripción"
                placeholder="Describe en detalle el problema que encontraste"
                value={formData.description}
                onChange={handleChange("description")}
                type="textarea"
                required
              />

              <CreatorInput
                label="steps para reproducir"
                placeholder="1. Abre la página\n2. Haz clic en...\n3. El error ocurre cuando..."
                value={formData.steps}
                onChange={handleChange("steps")}
                type="textarea"
                required
              />

              <CreatorInput
                label="Versión"
                placeholder="e.g. 1.0.0 o v2.1.3"
                value={formData.version}
                onChange={handleChange("version")}
                required
              />

              <CreatorInput
                label="Fecha del error"
                placeholder="e.g. 2024-12-15 o 15/12/2024"
                value={formData.error_date}
                onChange={handleChange("error_date")}
                required
              />

              <CreatorInput
                label="Email"
                placeholder="tu-email@ejemplo.com (opcional)"
                value={formData.email}
                onChange={handleChange("email")}
                type="email"
              />

              <CreatorInput
                label="URL de Screenshot"
                placeholder="https://ejemplo.com/screenshot.png (opcional)"
                value={formData.screenshot_url}
                onChange={handleChange("screenshot_url")}
                type="url"
              />
            </CreatorForm>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
