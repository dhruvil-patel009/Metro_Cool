"use client"

import { useEffect, useRef, useState } from "react"

const API = process.env.NEXT_PUBLIC_API_BASE_URL!

export default function ServiceContentPage() {
  const [services, setServices] = useState<any[]>([])
const [serviceIds, setServiceIds] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null);

  const [include, setInclude] = useState({ title:"", description:"", icon:"SearchCheck" })
  const [addon, setAddon] = useState({ title:"", description:"", price:"", image:"" })
  const [faq, setFaq] = useState({ question:"", answer:"" })
  const [addonFile, setAddonFile] = useState<File | null>(null);

  /* LOAD SERVICES */
  useEffect(() => {
    fetch(`${API}/service-content/list`)
      .then(r=>r.json())
      .then(setServices)
  }, [])

  /* ADD INCLUDE */
const addInclude = async () => {
  if (serviceIds.length === 0) return alert("Select at least one service")

  const res = await fetch(`${API}/service-content/include`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      service_ids: serviceIds,
      ...include
    })
  });

  const data = await res.json();
  if(!res.ok) return alert(data.error);

  alert("Include added to multiple services!");
  setInclude({ title:"", description:"", icon:"SearchCheck" });
};

  /* ADD ADDON */
const addAddon = async () => {
  if (!serviceIds) return alert("Select service first");
  if (!addon.title.trim()) return alert("Enter addon title");
  if (!addon.price) return alert("Enter addon price");

  const formData = new FormData();
formData.append("service_ids", JSON.stringify(serviceIds));
  formData.append("title", addon.title);
  formData.append("description", addon.description);
  formData.append("price", addon.price);

  if (addonFile) {
    formData.append("image", addonFile);
  }

  const res = await fetch(`${API}/service-content/addon`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  alert("Addon added!");

  // ⭐ RESET EVERYTHING
  setAddon({ title: "", description: "", price: "", image: "" });
  setAddonFile(null);
  if (fileRef.current) fileRef.current.value = "";
};

  /* ADD FAQ */
const addFaq = async () => {
  if (!serviceIds) return alert("Select service first");
  if (!faq.question.trim()) return alert("Enter question");
  if (!faq.answer.trim()) return alert("Enter answer");

  const res = await fetch(`${API}/service-content/faq`, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ service_ids:serviceIds, ...faq })
  });

  const data = await res.json();
  if(!res.ok) return alert(data.error);

  alert("FAQ added");
  setFaq({ question:"", answer:"" });
};

  return (
    <div className="p-10 space-y-10 max-w-3xl">
      <h1 className="text-2xl font-bold">Service Content Manager</h1>

      {/* SELECT SERVICE */}
<div className="space-y-2">
  <label className="font-semibold">Select Services</label>

  <div className="border rounded p-3 max-h-56 overflow-y-auto space-y-2">
    {services.map((s) => {
      const checked = serviceIds.includes(s.id)

      return (
        <label
          key={s.id}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              if (checked) {
                setServiceIds(prev => prev.filter(id => id !== s.id))
              } else {
                setServiceIds(prev => [...prev, s.id])
              }
            }}
            className="w-4 h-4"
          />

          <span>{s.title}</span>
        </label>
      )
    })}
  </div>

  <p className="text-xs text-gray-500">
    Selected: {serviceIds.length} services
  </p>
</div>

      {/* INCLUDE */}
      <div className="border p-4 rounded space-y-3">
        <h2 className="font-bold">Add "What's Included"</h2>
       <input
  className="border p-2 w-full"
  placeholder="Title"
  value={include.title}
  onChange={(e)=>setInclude({...include,title:e.target.value})}
/>

<input
  className="border p-2 w-full"
  placeholder="Description"
  value={include.description}
  onChange={(e)=>setInclude({...include,description:e.target.value})}
/>

<input
  className="border p-2 w-full"
  placeholder="Icon name (SearchCheck, Droplets...)"
  value={include.icon}
  onChange={(e)=>setInclude({...include,icon:e.target.value})}
/>
        <button onClick={addInclude} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Include
        </button>
      </div>

      {/* ADDON */}
      <div className="border p-4 rounded space-y-3">
        <h2 className="font-bold">Add Add-on</h2>
       <input
  className="border p-2 w-full"
  placeholder="Title"
  value={addon.title}
  onChange={(e)=>setAddon({...addon,title:e.target.value})}
/>

<input
  className="border p-2 w-full"
  placeholder="Description"
  value={addon.description}
  onChange={(e)=>setAddon({...addon,description:e.target.value})}
/>

<input
  className="border p-2 w-full"
  placeholder="Price"
  value={addon.price}
  onChange={(e)=>setAddon({...addon,price:e.target.value})}
/>
<input
  ref={fileRef}
  type="file"
  accept="image/*"
  onChange={(e) => setAddonFile(e.target.files?.[0] || null)}
/>
        <button onClick={addAddon} className="bg-green-600 text-white px-4 py-2 rounded">
          Add Addon
        </button>
      </div>

      {/* FAQ */}
      <div className="border p-4 rounded space-y-3">
        <h2 className="font-bold">Add FAQ</h2>
       <input
  className="border p-2 w-full"
  placeholder="Question"
  value={faq.question}
  onChange={(e)=>setFaq({...faq,question:e.target.value})}
/>

<textarea
  className="border p-2 w-full"
  placeholder="Answer"
  value={faq.answer}
  onChange={(e)=>setFaq({...faq,answer:e.target.value})}
/>
        <button onClick={addFaq} className="bg-purple-600 text-white px-4 py-2 rounded">
          Add FAQ
        </button>
      </div>
    </div>
  )
}