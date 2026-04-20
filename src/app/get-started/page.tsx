//Client side
"use client";

//React imports
import { useState, KeyboardEvent } from "react";

export default function GetStarted() {
  //State handlers
  const [screenSelected, setScreenSelected] = useState<number>(1);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] = useState<string>("");
  
  //Tags & Status state
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("Planning");

  //Integrants state
  const [emailInput, setEmailInput] = useState<string>("");
  const [integrants, setIntegrants] = useState<string[]>([]);

  //Constants
  const screens = 6;

  //Handlers for arrays
  const addTag = () => {
    if (tagInput.trim().length > 0 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addEmail = () => {
    if (emailInput.trim().length > 0 && !integrants.includes(emailInput.trim())) {
      setIntegrants([...integrants, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setIntegrants(integrants.filter(email => email !== emailToRemove));
  };

  const statusOptions = [
    { value: "Backlog", label: "Backlog", color: "bg-zinc-500" },
    { value: "Planning", label: "Planning", color: "bg-blue-400" },
    { value: "In Progress", label: "In Progress", color: "bg-orange-400" },
    { value: "On Hold", label: "On Hold", color: "bg-red-400" },
    { value: "Done", label: "Done", color: "bg-purple-500" },
  ];

  // Estado para controlar si el dropdown está abierto
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  return (
    <div className="w-screen overflow-hidden min-h-screen bg-[#0A0A0A] text-zinc-200 relative font-sans selection:bg-indigo-500/30">
      
      {/* Linear-style Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex justify-center">
        {/* Top subtle border glow */}
        <div className="absolute top-0 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Moving radial glow */}
        <div
          className={
            "absolute transition-all duration-1000 ease-out rounded-full bg-indigo-500/10 blur-[120px] " +
            (screenSelected === 1 ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" :
             screenSelected === 2 ? "top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" :
             screenSelected === 3 ? "bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]" :
             screenSelected === 4 ? "top-1/4 left-1/4 w-[500px] h-[500px]" :
             screenSelected === 5 ? "bottom-1/4 right-1/4 w-[600px] h-[600px]" :
             "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10")
          }
        />
      </div>

      {/* Screen 1: Start */}
      <section className={"flex-col justify-center items-center w-full min-h-screen text-center animate-fade-in px-6 py-2 relative z-10 " + (screenSelected === 1 ? "flex" : "hidden")}>
        <div className="border border-white/10 bg-white/[0.02] backdrop-blur-md px-4 py-1.5 rounded-full mb-8 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">PrismaFlow 2.0</span>
        </div>
        <h1 className="text-4xl xl:text-6xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6">
          Streamline your workflow
        </h1>
        <p className="text-base xl:text-lg text-zinc-400 font-light max-w-lg mb-10">
          Plan, build, and ship your next big idea with absolute clarity.
        </p>

        <button
          className="text-sm font-medium px-8 py-3 rounded-full bg-white text-black hover:bg-zinc-200 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          onClick={() => setScreenSelected(2)}
        >
          Start a new project
        </button>
      </section>

      {/* Screen 2: Name */}
      <section className={"flex-col justify-center items-center w-full min-h-screen text-center animate-fade-in px-6 py-2 relative z-10 " + (screenSelected === 2 ? "flex" : "hidden")}>
        <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-10">
          What are we building?
        </h1>

        <div className="relative group w-full max-w-xl">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            required
            placeholder="e.g. Project Apollo"
            className="w-full bg-[#121212] border border-white/10 rounded-xl px-6 py-4 text-lg xl:text-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner"
          />
        </div>

        <div className="flex gap-4 mt-12">
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            onClick={() => setScreenSelected(1)}
          >
            Back
          </button>
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            disabled={newProjectName.trim().length <= 0}
            onClick={() => setScreenSelected(3)}
          >
            Continue
          </button>
        </div>
      </section>

      {/* Screen 3: Description */}
      <section className={"flex-col justify-center items-center w-full min-h-screen text-center animate-fade-in px-6 py-2 relative z-10 " + (screenSelected === 3 ? "flex" : "hidden")}>
        <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-10">
          Describe your vision
        </h1>

        <textarea
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="Briefly explain the core objective of this project..."
          className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-xl px-6 py-4 text-base xl:text-lg text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner min-h-[160px] resize-none"
        />

        <div className="flex gap-4 mt-12">
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            onClick={() => setScreenSelected(2)}
          >
            Back
          </button>
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            disabled={newProjectDescription.trim().length <= 0}
            onClick={() => setScreenSelected(4)}
          >
            Continue
          </button>
        </div>
      </section>

      {/* Screen 4: Tags & Status */}
      <section className={"flex-col justify-center items-center w-full min-h-screen animate-fade-in px-6 py-2 relative z-10 " + (screenSelected === 4 ? "flex" : "hidden")}>
        <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-12 text-center">
          Details & Status
        </h1>

        <div className="flex flex-col gap-8 w-full max-w-xl">
          {/* Custom Status Selection */}
<div className="w-full flex flex-col items-start gap-3 relative">
  <label className="text-sm font-medium text-zinc-400 text-left">Project Status</label>
  
  {/* Trigger Button */}
  <button
    type="button"
    onClick={() => setIsStatusOpen(!isStatusOpen)}
    className="w-full flex items-center justify-between bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white hover:bg-[#181818] transition-all duration-200 group"
  >
    <div className="flex items-center gap-3">
      {/* Dynamic Status Icon */}
      <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)] ${
        statusOptions.find(opt => opt.value === status)?.color || "bg-zinc-500"
      }`} />
      <span className="text-sm font-medium">{status}</span>
    </div>
    
    <svg 
      className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} 
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {/* Dropdown Menu */}
  {isStatusOpen && (
    <>
      {/* Overlay invisible para cerrar al hacer click fuera */}
      <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
      
      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#161616] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-1">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setStatus(option.value);
                setIsStatusOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                status === option.value 
                ? 'bg-white/10 text-white' 
                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${option.color}`} />
              <span className="flex-1 text-left">{option.label}</span>
              {status === option.value && (
                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  )}
</div>

          {/* Tags Input */}
          <div className="w-full flex flex-col items-start gap-3">
            <label className="text-sm font-medium text-zinc-400">Labels</label>
            <div className="flex w-full gap-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') addTag(); }}
                placeholder="e.g. Frontend, Marketing"
                className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
              />
              <button 
                onClick={addTag}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/5 text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                Add
              </button>
            </div>
            
            {/* Tag Pills */}
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 flex items-center gap-2 hover:bg-white/10 transition-colors">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-zinc-500 hover:text-white transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-12">
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            onClick={() => setScreenSelected(3)}
          >
            Back
          </button>
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            onClick={() => setScreenSelected(5)}
          >
            Continue
          </button>
        </div>
      </section>

      {/* Screen 5: Integrants */}
      <section className={"flex-col justify-center items-center w-full min-h-screen animate-fade-in px-6 py-2 relative z-10 " + (screenSelected === 5 ? "flex" : "hidden")}>
        <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-12 text-center">
          Invite your team
        </h1>

        <div className="flex flex-col w-full max-w-xl gap-4">
          <div className="flex w-full gap-3">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') addEmail(); }}
              placeholder="colleague@company.com"
              className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
            />
            <button 
              onClick={addEmail}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
            >
              Invite
            </button>
          </div>
          
          <div className="flex flex-col w-full gap-2 mt-4 text-left">
            {integrants.length === 0 && <span className="text-sm text-zinc-600 text-center py-4">No team members added yet.</span>}
            {integrants.map((email, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[#121212] px-4 py-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-zinc-300">{email}</span>
                </div>
                <button onClick={() => removeEmail(email)} className="text-xs font-medium text-zinc-500 hover:text-red-400 transition-colors">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-12">
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            onClick={() => setScreenSelected(4)}
          >
            Back
          </button>
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white text-black hover:bg-zinc-200 transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            onClick={() => setScreenSelected(6)}
          >
            Review Project
          </button>
        </div>
      </section>

      {/* Screen 6: Finished Summary */}
      <section className={"flex-col justify-center items-center w-full min-h-screen animate-fade-in px-6 py-2 relative z-10 " + (screenSelected === 6 ? "flex" : "hidden")}>
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8 text-center">
            Ready to launch
          </h1>

          <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white tracking-tight">{newProjectName}</h2>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]"></span>
                {status}
              </span>
            </div>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 pb-8 border-b border-white/10">
              {newProjectDescription}
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? tags.map((tag, i) => (
                    <span key={i} className="text-xs font-medium bg-white/5 border border-white/10 text-zinc-300 px-2.5 py-1 rounded-md">
                      {tag}
                    </span>
                  )) : <span className="text-xs text-zinc-600">No labels applied</span>}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">Team ({integrants.length})</h3>
                <div className="space-y-2">
                  {integrants.length > 0 ? integrants.map((member, i) => (
                    <div key={i} className="text-sm font-medium text-zinc-300 truncate flex items-center gap-2">
                       <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                        {member.charAt(0).toUpperCase()}
                      </span>
                      {member}
                    </div>
                  )) : <span className="text-xs text-zinc-600">Just you</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-10">
            <button
              className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              onClick={() => setScreenSelected(5)}
            >
              Go Back
            </button>
            <button
              className="text-sm font-medium px-8 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
              onClick={() => {
                console.log("Creating Project...", { name: newProjectName, description: newProjectDescription, status, tags, team: integrants });
                alert("Project created successfully!");
              }}
            >
              Create Project
            </button>
          </div>
        </div>
      </section>

      {/* Modern Progress Indicator */}
      <section className="w-full flex justify-center items-center gap-3 py-6 fixed bottom-0 left-1/2 -translate-x-1/2 z-20">
        {Array.from({ length: screens }, (_, index) => {
          const i = index + 1;
          return (
            <div
              key={i}
              className={
                "h-1 rounded-full transition-all duration-500 " +
                (screenSelected === i ? "w-8 bg-white" : screenSelected > i ? "w-4 bg-white/30" : "w-2 bg-white/10")
              }
            />
          );
        })}
      </section>
    </div>
  );
}