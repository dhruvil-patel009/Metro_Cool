import { Button } from "@/app/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { StatCards } from "./components/state-cards";
import { JobList } from "./components/job-list";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Dashboard() {
  return (
    <>
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome back, Alex
          </h1>
          <div className="flex items-center py-4 gap-4 text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Monday, Oct 24</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <p className="text-sm">
              You have <span className="text-blue-500 font-bold">4 jobs</span>{" "}
              today
            </p>
          </div>
        </div>
        <Button className="bg-blue-600 text-white px-8 py-4 rounded-md font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </Button>
      </section>

      <StatCards />

      <JobList />
    </>
  );
}
