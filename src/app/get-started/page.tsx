//Client side
"use client";

//Prebuilt ui imports
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

//React imports
import { useState, KeyboardEvent, useRef, useEffect } from "react";

//Services imports
import { getSessionStr } from "@/services/session.service";
import UpdateUserData from "@/services/user.service";

//Next import
import { useRouter } from "next/navigation";

export default function GetStarted() {
  //Router statement
  const router = useRouter();

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
  const [integrants, setIntegrants] = useState<Array<string>>([]);

  //Form state
  const [ disabled, setDisabled ] = useState<boolean>(false);
  
  //Snackbar container
  const snackbar = useRef(null);

  //Constants
  const screens = 6;

  useEffect(() => {
    async function validator(){
      const token = getSessionStr();

      if(!token) return window.location.href = "/auth/signin";

      const user = await UpdateUserData({ router });

      if(!user) return router.push("/");
      
      //Created at to Date
      const created_at = new Date(user.created_at!);
      //Date now
      const now = new Date();

      if(created_at.getDay() !== now.getDay() || user.teams?.length! > 0) {
        return window.location.href = "dashboard";
      }
    }

    validator();
  }, []);

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

  //Project creator
  const createProject = async() => {
    //Id isn't cached gets the data
    const token = getSessionStr();

    if(!token) {
      //If hasn't token returns to log in form
      window.location.href = "/auth/signin";
    };

    const user = JSON.parse(localStorage.getItem("user")!);

    //Only the current user as admin
    const found = [{
      id: user.id,
      email: user.email,
      username: user.name,
      type: "admin"
    }];

    const integrants_id : Array<string> = [];

    found.forEach(integrant => {
      integrants_id.push(integrant.id);
    })

    const newProject = {
      name: newProjectName,
      description: newProjectDescription,
      integrants: found,
      integrants_id: integrants_id,
      tags: tags,
      status: status
    }

    //Fetchs to api
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        "Authorization": token!,
      },
      body: JSON.stringify(newProject)
    });

    //Handles the response
    const data = await res.json();

    //If success, returns the data
    if(res.status === 200) {
      //Returns success with the team data
      return { success: true, team: data.team };
    }

    //Else, returns error
    showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar)
    return { success: false, team: null };
  }

  //Send invitations to the emails inserted
  const sendInvitations = async(teamId: string | number) => {
    const token = getSessionStr();

    if(!token) {
      window.location.href = "/auth/signin";
      return;
    }

    //Get current user email
    const user = JSON.parse(localStorage.getItem("user")!);
    const currentUserEmail = user.email;

    //Send invitation to each email
    for (const email of integrants) {
      try {
        //Check if user is trying to invite themselves
        if(email === currentUserEmail) {
          showSnackbar("You can't invite yourself", "warn", snackbar)
          continue;
        }

        //First, verify if the user exists
        const searchRes = await fetch(`/api/users/search/${email}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!
          }
        });

        const searchData = await searchRes.json();

        //If user doesn't exist, show error
        if(searchRes.status !== 200 || !searchData.users || searchData.users.length === 0) {
          showSnackbar("User don't found", "warn", snackbar)
          continue;
        }

        //Send the invitation
        const res = await fetch(`/api/teams/${teamId}/integrants/request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            "Authorization": token,
          },
          body: JSON.stringify({
            requested_email: email
          })
        });

        //Handles the response
        const data = await res.json();

        //If success, show success message
        if(res.status === 200) {
          showSnackbar("Invitation sent!", "valid", snackbar);
        }
        //Else, show error
        else {
          showSnackbar(data.message, (res.status >= 500 ? "critic" : "warn"), snackbar)
        }
      } catch(e: unknown) {
        if(e instanceof Error) {
          showSnackbar(e.message, "critic", snackbar);
        }
        
        showSnackbar("Server error", "critic", snackbar);
        return;
      }
    }
  }

  //Function when users press "launch"
  const handleCreateProject = async() => {
    //Disable button during process
    setDisabled(true);

    //Create the project
    const result = await createProject();

    if(!result.success || !result.team) {
      setDisabled(false);
      return;
    }

    const teamId = result.team.team_id;

    //Send invitations to all emails
    if(integrants.length > 0) {
      await sendInvitations(teamId);
    }

    //If all is ok sets the data in cache
    const user = JSON.parse(localStorage.getItem("user")!);
    user.teams.push(result.team);
    window.localStorage.setItem("user", JSON.stringify(user));

    setDisabled(false);
    window.location.href = "/dashboard";
  }

  return (
    <div className="w-screen overflow-hidden min-h-screen bg-[#0A0A0A] text-zinc-200 relative font-sans selection:bg-indigo-500/30">
    <SnackBar ref={snackbar} />
      
      {/* Linear-style Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex justify-center">
        {/* Top subtle border glow */}
        <div className="absolute top-0 w-200 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Moving radial glow */}
        <div
          className={
            "absolute transition-all duration-1000 ease-out rounded-full bg-main/15 blur-3xl animate-pulse aspect-square blockd " +
            (screenSelected === 1 ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200" :
             screenSelected === 2 ? "top-1/2 left-1/2 -translate-x-1/2 w-300" :
             screenSelected === 3 ? "-top-1/2 left-1/2 -translate-x-1/2 w-250" :
             screenSelected === 4 ? "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-200" :
             screenSelected === 5 ? "top-1/4 right-1/4 w-300" :
             "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200")
          }
        />
      </div>

      {/* Screen 1: Start */}
      <section className={"flex-col justify-center items-center w-full min-h-screen text-center animate-fade-in-up px-6 py-2 relative z-10 " + (screenSelected === 1 ? "flex" : "hidden")}>
        <h1 className="text-4xl xl:text-6xl font-semibold tracking-tight text-text mb-6">
          Welcome to this new experience
        </h1>
        <p className="text-base xl:text-lg text-zinc-400 font-light max-w-lg mb-10">
          In nexzero our principal goal is a better flow in your proyect
        </p>

        <button
          className="text-sm font-medium px-8 py-3 rounded-full bg-main text-text hover:brightness-80 duration-400 cursor-pointer"
          onClick={() => setScreenSelected(2)}
        >
          Start a new project
        </button>
      </section>

      {/* Screen 2: Name */}
      <section className={"flex-col justify-center items-center w-full min-h-screen text-center animate-fade-in-up px-6 py-2 relative z-10 " + (screenSelected === 2 ? "flex" : "hidden")}>
        <h1 className="text-2xl xl:text-3xl font-semibold tracking-tight text-text mb-6">
          What are we building?
        </h1>

        <div className="relative group w-full max-w-xl">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            required
            placeholder="e.g. Project Apollo"
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-6 py-4 text-lg xl:text-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner"
          />
        </div>

        <div className="flex gap-4 mt-12">
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
            onClick={() => setScreenSelected(1)}
          >
            Back
          </button>
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-main text-text hover:brightness-80 cursor-pointer transition-all duration-200 disabled:brightness-80 disabled:cursor-not-allowed"
            disabled={newProjectName.trim().length <= 0}
            onClick={() => setScreenSelected(3)}
          >
            Continue
          </button>
        </div>
      </section>

      {/* Screen 3: Description */}
      <section className={"flex-col justify-center items-center w-full min-h-screen text-center animate-fade-in px-6 py-2 relative z-10 " + (screenSelected === 3 ? "flex" : "hidden")}>
        <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-text mb-10">
          Describe your vision
        </h1>

        <textarea
          value={newProjectDescription}
          onChange={(e) => setNewProjectDescription(e.target.value)}
          placeholder="Briefly explain the core objective of this project..."
          className="w-full max-w-2xl bg-[#121212] border border-white/10 rounded-xl px-6 py-4 text-base xl:text-lg text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300 shadow-inner min-h-40 resize-none"
        />

        <div className="flex gap-4 mt-12">
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
            onClick={() => setScreenSelected(2)}
          >
            Back
          </button>
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-main text-text hover:brightness-80 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            disabled={newProjectName.trim().length <= 0}
            onClick={() => setScreenSelected(4)}
          >
            Continue
          </button>
        </div>
      </section>

      {/* Screen 4: Tags & Status */}
      <section className={"flex-col justify-center items-center w-full min-h-screen animate-fade-in-up px-6 py-2 relative z-10 " + (screenSelected === 4 ? "flex" : "hidden")}>
        <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-text mb-12 text-center">
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
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' || e.key === " ") addTag();
                }}
                placeholder="e.g. Frontend, Marketing"
                className="flex-1 bg-[#121212] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
              />
              <button 
                onClick={addTag}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/5 text-white text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
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
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
            onClick={() => setScreenSelected(3)}
          >
            Back
          </button>
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-main text-text hover:brightness-80 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            disabled={newProjectName.trim().length <= 0}
            onClick={() => setScreenSelected(5)}
          >
            Continue
          </button>
        </div>
      </section>

      {/* Screen 5: Integrants */}
      <section className={"flex-col justify-center items-center w-full min-h-screen animate-fade-in-up px-6 py-2 relative z-10 " + (screenSelected === 5 ? "flex" : "hidden")}>
        <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-text mb-12 text-center">
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
              className="px-6 py-3 bg-main hover:brightness-80 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(79,70,229,0.2)] cursor-pointer"
            >
              Invite
            </button>
          </div>
          
          <div className="flex flex-col w-full gap-2 mt-4 text-left">
            {integrants.length === 0 && <span className="text-sm text-zinc-600 text-center py-4">No team members added yet.</span>}
            {integrants.map((email, idx) => (
              <div key={idx} className="flex justify-between items-center bg-[#121212] px-4 py-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-main to-blue-950 flex items-center justify-center text-xs font-bold text-white">
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
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
            onClick={() => setScreenSelected(4)}
          >
            Back
          </button>
          <button
            className="text-sm font-medium px-6 py-2.5 rounded-full bg-main text-text hover:brightness-80 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            onClick={() => setScreenSelected(6)}
          >
            Review your proyect
          </button>
        </div>
      </section>

      {/* Screen 6: Finished Summary */}
      <section className={"flex-col justify-center items-center w-full min-h-screen animate-fade-in-up px-6 py-2 relative z-10 " + (screenSelected === 6 ? "flex" : "hidden")}>
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl xl:text-5xl font-medium tracking-tight text-text mb-8 text-center">
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
              className="text-sm font-medium px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer disabled:hover:bg-white/5 disabled:hover:text-zinc-300 disabled:brightness-70 disabled:grayscale disabled:cursor-wait"
              disabled={disabled}
              onClick={() => setScreenSelected(5)}
            >
              Go Back
            </button>
            <button
              className="text-sm font-medium px-8 py-2.5 rounded-full text-text bg-main cursor-pointer hover:brightness-80 disabled:hover:brightness-100 disabled:opacity-70 disabled:cursor-wait transition-all duration-200 flex items-center gap-2"
              disabled={disabled}
              onClick={handleCreateProject}
            >
              {disabled ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Launch'
              )}
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