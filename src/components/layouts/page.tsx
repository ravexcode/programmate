//Prebuit ui imports
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";



export default function PageLayout({
  children
} : {
  children: React.ReactNode;
}) {
  return (
    <div
    className="min-h-screen grid grid-rows-[auto_1fr_auto] text-text bg-background">
      <Header />

        {children}

      <Footer />
    </div>
  )
}