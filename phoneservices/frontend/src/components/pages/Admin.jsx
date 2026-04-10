import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCatalog,
  saveCatalog,
} from "@/components/data/phones";
import { getDefaultSiteContent } from "@/components/data/siteContent";
import { catalogApi } from "@/lib/catalogApi";
import { clearAdminToken } from "@/lib/adminAuth";
import { slugify } from "@/lib/utils/slugify";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Admin = () => {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState(getCatalog());
  const [siteContent, setSiteContent] = useState(getDefaultSiteContent());

  const [editingDeviceId, setEditingDeviceId] = useState(null);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editingModelId, setEditingModelId] = useState(null);

  const [deviceForm, setDeviceForm] = useState({ id: "", label: "", desc: "", iconUrl: "" });
  const [brandForm, setBrandForm] = useState({ id: "", name: "", types: "smartphone", logoUrl: "" });
  const [modelForm, setModelForm] = useState({
    id: "",
    brandId: "",
    name: "",
    modelCode: "",
    type: "smartphone",
    year: "",
    imageUrl: "",
  });

  const [manageType, setManageType] = useState("smartphone");
  const [manageBrandId, setManageBrandId] = useState("");
  const [manageModelId, setManageModelId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingSlideId, setEditingSlideId] = useState(null);
  const [slideForm, setSlideForm] = useState({ id: "", title: "", sub: "", imageUrl: "" });

  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    id: "",
    name: "",
    rating: "5",
    text: "",
    device: "",
    date: "",
    avatar: "",
  });

  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUserEmail, setEditingUserEmail] = useState("");
  const [userForm, setUserForm] = useState({
    email: "",
    role: "editor",
    password: "",
  });

  const handleUnauthorized = useCallback(() => {
    clearAdminToken();
    navigate("/admin/login", { replace: true, state: { from: "/admin" } });
  }, [navigate]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const remoteCatalog = await catalogApi.getCatalog();
      saveCatalog(remoteCatalog);
      setCatalog(remoteCatalog);
    } catch (err) {
      if (err?.status === 401) {
        handleUnauthorized();
        return;
      }
      setError(err.message || "Failed to load catalog from API");
      setCatalog(getCatalog());
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  const brandOptions = useMemo(() => catalog.brands || [], [catalog.brands]);
  const typeOptions = useMemo(() => catalog.deviceTypes || [], [catalog.deviceTypes]);
  const manageBrands = useMemo(
    () => (catalog.brands || []).filter((b) => (b.types || []).includes(manageType)),
    [catalog.brands, manageType]
  );
  const manageModels = useMemo(
    () =>
      (catalog.models || []).filter(
        (m) => (!manageType || m.type === manageType) && (!manageBrandId || m.brandId === manageBrandId)
      ),
    [catalog.models, manageType, manageBrandId]
  );
  const brandMap = useMemo(
    () => Object.fromEntries((catalog.brands || []).map((b) => [b.id, b.name])),
    [catalog.brands]
  );

  const refreshSiteContent = useCallback(async () => {
    const remoteSiteContent = await catalogApi.getSiteContent();
    setSiteContent(remoteSiteContent);
  }, []);

  const refreshAdminUsers = useCallback(async () => {
    const response = await catalogApi.getAdminUsers();
    setAdminUsers(response?.users || []);
  }, []);

  const submitDevice = async (e) => {
    e.preventDefault();
    const payload = {
      id: slugify(deviceForm.id || deviceForm.label),
      label: deviceForm.label.trim(),
      desc: deviceForm.desc.trim(),
      iconUrl: deviceForm.iconUrl || "",
    };
    if (!payload.id || !payload.label) return;

    await safeCall(async () => {
      if (editingDeviceId) await catalogApi.updateDeviceType(editingDeviceId, payload);
      else await catalogApi.createDeviceType(payload);

      setEditingDeviceId(null);
      setDeviceForm({ id: "", label: "", desc: "", iconUrl: "" });
      await refresh();
    });
  };

  const submitBrand = async (e) => {
    e.preventDefault();
    const types = brandForm.types
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const payload = {
      name: brandForm.name.trim(),
      types,
      logoUrl: brandForm.logoUrl || "",
    };
    if (!payload.name || types.length === 0) return;

    await safeCall(async () => {
      if (editingBrandId) await catalogApi.updateBrand(editingBrandId, payload);
      else await catalogApi.createBrand(payload);

      setEditingBrandId(null);
      setBrandForm({ id: "", name: "", types: "smartphone", logoUrl: "" });
      await refresh();
    });
  };

  const submitModel = async (e) => {
    e.preventDefault();
    const payload = {
      brandId: modelForm.brandId,
      name: modelForm.name.trim(),
      modelCode: modelForm.modelCode.trim(),
      type: modelForm.type,
      year: Number(modelForm.year) || undefined,
      imageUrl: modelForm.imageUrl || "",
    };
    if (!payload.brandId || !payload.name || !payload.type) return;

    await safeCall(async () => {
      if (editingModelId) await catalogApi.updateModel(editingModelId, payload);
      else await catalogApi.createModel(payload);

      setEditingModelId(null);
      setManageModelId("");
      setModelForm({
        id: "",
        brandId: "",
        name: "",
        modelCode: "",
        type: "smartphone",
        year: "",
        imageUrl: "",
      });
      await refresh();
    });
  };

  const loadModelForEdit = (modelId) => {
    const model = (catalog.models || []).find((m) => m.id === modelId);
    if (!model) return;
    setEditingModelId(model.id);
    setManageType(model.type || "smartphone");
    setManageBrandId(model.brandId || "");
    setManageModelId(model.id);
    setModelForm({
      id: "",
      brandId: model.brandId || "",
      name: model.name || "",
      modelCode: model.modelCode || "",
      type: model.type || "smartphone",
      year: String(model.year || ""),
      imageUrl: model.imageUrl || "",
    });
  };

  const exportCatalog = () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "phoneservices-catalog.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCatalog = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const imported = JSON.parse(text);
    const remoteCatalog = await catalogApi.importCatalog(imported);
    saveCatalog(remoteCatalog);
    setCatalog(remoteCatalog);
    e.target.value = "";
  };

  const pickImage = async (e, setter, folder) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await safeCall(async () => {
      const dataUrl = await fileToDataUrl(file);
      const uploaded = await catalogApi.uploadImage(dataUrl, folder);
      setter(uploaded.imageUrl);
    });
    e.target.value = "";
  };

  const safeCall = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      if (err?.status === 401) {
        handleUnauthorized();
        return;
      }
      setError(err.message || "Request failed");
    }
  };

  const submitSlide = async (e) => {
    e.preventDefault();
    const payload = {
      id: slugify(slideForm.id || slideForm.title),
      title: slideForm.title.trim(),
      sub: slideForm.sub.trim(),
      imageUrl: slideForm.imageUrl.trim(),
    };
    if (!payload.id || !payload.title || !payload.imageUrl) return;

    await safeCall(async () => {
      if (editingSlideId) await catalogApi.updateCarouselSlide(editingSlideId, payload);
      else await catalogApi.createCarouselSlide(payload);
      await refreshSiteContent();
    });
    setEditingSlideId(null);
    setSlideForm({ id: "", title: "", sub: "", imageUrl: "" });
  };

  const editSlide = (slide) => {
    setEditingSlideId(slide.id);
    setSlideForm({
      id: slide.id,
      title: slide.title || "",
      sub: slide.sub || "",
      imageUrl: slide.imageUrl || "",
    });
  };

  const deleteSlide = async (id) => {
    await safeCall(async () => {
      await catalogApi.deleteCarouselSlide(id);
      await refreshSiteContent();
    });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    const payload = {
      id: slugify(feedbackForm.id || `${feedbackForm.name}-${feedbackForm.device}`),
      name: feedbackForm.name.trim(),
      rating: Math.max(1, Math.min(5, Number(feedbackForm.rating) || 5)),
      text: feedbackForm.text.trim(),
      device: feedbackForm.device.trim(),
      date: feedbackForm.date.trim() || "recent",
      avatar: (feedbackForm.avatar || feedbackForm.name || "?").trim().slice(0, 2).toUpperCase(),
    };
    if (!payload.id || !payload.name || !payload.text) return;

    await safeCall(async () => {
      if (editingFeedbackId) await catalogApi.updateCustomerFeedback(editingFeedbackId, payload);
      else await catalogApi.createCustomerFeedback(payload);
      await refreshSiteContent();
    });
    setEditingFeedbackId(null);
    setFeedbackForm({ id: "", name: "", rating: "5", text: "", device: "", date: "", avatar: "" });
  };

  const editFeedback = (review) => {
    setEditingFeedbackId(review.id);
    setFeedbackForm({
      id: review.id,
      name: review.name || "",
      rating: String(review.rating || 5),
      text: review.text || "",
      device: review.device || "",
      date: review.date || "",
      avatar: review.avatar || "",
    });
  };

  const deleteFeedback = async (id) => {
    await safeCall(async () => {
      await catalogApi.deleteCustomerFeedback(id);
      await refreshSiteContent();
    });
  };

  const submitAdminUser = async (e) => {
    e.preventDefault();
    const payload = {
      email: String(userForm.email || "").toLowerCase().trim(),
      role: userForm.role,
      ...(userForm.password ? { password: userForm.password } : {}),
    };

    if (!payload.email) return;
    if (!editingUserEmail && !payload.password) {
      setError("Password is required when creating a new admin user");
      return;
    }

    await safeCall(async () => {
      if (editingUserEmail) await catalogApi.updateAdminUser(editingUserEmail, payload);
      else await catalogApi.createAdminUser(payload);
      await refreshAdminUsers();
    });

    setEditingUserEmail("");
    setUserForm({ email: "", role: "editor", password: "" });
  };

  const editAdminUser = (user) => {
    setEditingUserEmail(user.email);
    setUserForm({ email: user.email, role: user.role, password: "" });
  };

  const deleteAdminUser = async (email) => {
    await safeCall(async () => {
      await catalogApi.deleteAdminUser(email);
      await refreshAdminUsers();
    });
  };

  useEffect(() => {
    refresh();
    refreshSiteContent().catch((err) => {
      if (err?.status === 401) {
        handleUnauthorized();
        return;
      }
      setSiteContent(getDefaultSiteContent());
    });
    refreshAdminUsers().catch((err) => {
      if (err?.status === 401) {
        handleUnauthorized();
        return;
      }
      setError(err.message || "Failed to load admin users");
      setAdminUsers([]);
    });
  }, [handleUnauthorized, refresh, refreshAdminUsers, refreshSiteContent]);

  return (
    <div className="min-h-screen bg-muted p-6 pt-24 md:p-10 md:pt-24">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="sticky top-4 z-30 rounded-2xl border border-border bg-background/95 p-4 shadow-card backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin Area</p>
              <p className="text-sm text-muted-foreground">You are managing catalog content.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-background p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-black text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage devices, brands, models, and images.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-xl border border-border px-4 py-2 text-sm font-semibold">
                Import JSON
                <input type="file" accept="application/json" className="hidden" onChange={importCatalog} />
              </label>
              <button onClick={exportCatalog} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  safeCall(async () => {
                    const remoteCatalog = await catalogApi.resetCatalog();
                    saveCatalog(remoteCatalog);
                    setCatalog(remoteCatalog);
                  });
                }}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Reset Defaults
              </button>
              <button
                type="button"
                onClick={() => {
                  catalogApi.logout().finally(() => {
                    clearAdminToken();
                    navigate("/admin/login", { replace: true });
                  });
                }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => {
                  safeCall(async () => {
                    const remoteSiteContent = await catalogApi.resetSiteContent();
                    setSiteContent(remoteSiteContent);
                  });
                }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
              >
                Reset Site Content
              </button>
            </div>
          </div>
          {loading ? <p className="mt-3 text-sm text-muted-foreground">Syncing with API...</p> : null}
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="rounded-2xl bg-background p-5 shadow-card">
            <h2 className="mb-4 text-xl font-bold">Devices</h2>
            <form className="space-y-2" onSubmit={submitDevice}>
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="ID (optional)" value={deviceForm.id} onChange={(e) => setDeviceForm((s) => ({ ...s, id: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Label" value={deviceForm.label} onChange={(e) => setDeviceForm((s) => ({ ...s, label: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Description" value={deviceForm.desc} onChange={(e) => setDeviceForm((s) => ({ ...s, desc: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Icon URL" value={deviceForm.iconUrl} onChange={(e) => setDeviceForm((s) => ({ ...s, iconUrl: e.target.value }))} />
              <label className="block cursor-pointer rounded-lg border border-border px-3 py-2 text-sm">Upload icon
                <input type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e, (url) => setDeviceForm((s) => ({ ...s, iconUrl: url })), "phoneservices/device-icons")} />
              </label>
              <button className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{editingDeviceId ? "Update" : "Add"} Device</button>
            </form>
            <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2 space-y-2">
              {catalog.deviceTypes.map((d) => (
                <div key={d.id} className="rounded-xl border border-border bg-background p-3 text-sm shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {d.iconUrl ? <img src={d.iconUrl} alt={d.label} className="h-8 w-8 object-contain" /> : <span className="text-lg">#</span>}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{d.label}</div>
                        <div className="text-xs text-muted-foreground">{d.id}</div>
                        {d.desc ? <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{d.desc}</div> : null}
                      </div>
                    </div>
                    <div className="mt-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">device</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted" onClick={() => { setEditingDeviceId(d.id); setDeviceForm({ id: d.id, label: d.label || "", desc: d.desc || "", iconUrl: d.iconUrl || "" }); }}>Edit</button>
                    <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50" onClick={() => safeCall(async () => { await catalogApi.deleteDeviceType(d.id); await refresh(); })}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-background p-5 shadow-card">
            <h2 className="mb-4 text-xl font-bold">Brands</h2>
            <form className="space-y-2" onSubmit={submitBrand}>
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="ID (optional)" value={brandForm.id} onChange={(e) => setBrandForm((s) => ({ ...s, id: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Brand name" value={brandForm.name} onChange={(e) => setBrandForm((s) => ({ ...s, name: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Types: smartphone,tablet" value={brandForm.types} onChange={(e) => setBrandForm((s) => ({ ...s, types: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Logo URL" value={brandForm.logoUrl} onChange={(e) => setBrandForm((s) => ({ ...s, logoUrl: e.target.value }))} />
              <label className="block cursor-pointer rounded-lg border border-border px-3 py-2 text-sm">Upload logo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e, (url) => setBrandForm((s) => ({ ...s, logoUrl: url })), "phoneservices/brand-logos")} />
              </label>
              <button className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{editingBrandId ? "Update" : "Add"} Brand</button>
            </form>
            <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2 space-y-2">
              {catalog.brands.map((b) => (
                <div key={b.id} className="rounded-xl border border-border bg-background p-3 text-sm shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {b.logoUrl ? <img src={b.logoUrl} alt={b.name} className="h-8 w-8 object-contain" /> : <span className="text-[11px] font-bold">{(b.name || "?").slice(0, 2).toUpperCase()}</span>}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{b.name}</div>
                        <div className="text-xs text-muted-foreground">{b.id}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(b.types || []).map((type) => (
                            <span key={`${b.id}-${type}`} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{type}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted" onClick={() => { setEditingBrandId(b.id); setBrandForm({ id: b.id, name: b.name || "", types: (b.types || []).join(","), logoUrl: b.logoUrl || "" }); }}>Edit</button>
                    <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50" onClick={() => safeCall(async () => { await catalogApi.deleteBrand(b.id); await refresh(); })}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-background p-5 shadow-card">
            <h2 className="mb-4 text-xl font-bold">Models</h2>

            <div className="mb-4 rounded-xl bg-black text-white p-3 space-y-2">
              <div className="text-sm font-semibold">Quick Update Selector</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  className="w-full rounded-lg border border-white/20 bg-black px-3 py-2 text-sm"
                  value={manageType}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    setManageType(nextType);
                    setManageBrandId("");
                    setManageModelId("");
                  }}
                >
                  {typeOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label || t.id}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full rounded-lg border border-white/20 bg-black px-3 py-2 text-sm"
                  value={manageBrandId}
                  onChange={(e) => {
                    setManageBrandId(e.target.value);
                    setManageModelId("");
                  }}
                >
                  <option value="">Select brand</option>
                  {manageBrands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full rounded-lg border border-white/20 bg-black px-3 py-2 text-sm"
                  value={manageModelId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setManageModelId(id);
                    if (id) loadModelForEdit(id);
                  }}
                >
                  <option value="">Select model</option>
                  {manageModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form className="space-y-2" onSubmit={submitModel}>
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="ID (optional)" value={modelForm.id} onChange={(e) => setModelForm((s) => ({ ...s, id: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Model name" value={modelForm.name} onChange={(e) => setModelForm((s) => ({ ...s, name: e.target.value }))} />
              <select className="w-full rounded-lg border border-border px-3 py-2" value={modelForm.brandId} onChange={(e) => setModelForm((s) => ({ ...s, brandId: e.target.value }))}>
                <option value="">Select brand</option>
                {brandOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select className="w-full rounded-lg border border-border px-3 py-2" value={modelForm.type} onChange={(e) => setModelForm((s) => ({ ...s, type: e.target.value }))}>
                {typeOptions.map((t) => <option key={t.id} value={t.id}>{t.label || t.id}</option>)}
              </select>
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Model code" value={modelForm.modelCode} onChange={(e) => setModelForm((s) => ({ ...s, modelCode: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Year" value={modelForm.year} onChange={(e) => setModelForm((s) => ({ ...s, year: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Image URL" value={modelForm.imageUrl} onChange={(e) => setModelForm((s) => ({ ...s, imageUrl: e.target.value }))} />
              <label className="block cursor-pointer rounded-lg border border-border px-3 py-2 text-sm">Upload model image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e, (url) => setModelForm((s) => ({ ...s, imageUrl: url })), "phoneservices/model-images")} />
              </label>
              <button className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{editingModelId ? "Update" : "Add"} Model</button>
            </form>
            <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2 space-y-2">
              {manageModels.map((m) => (
                <div key={m.id} className="rounded-xl border border-border bg-background p-3 text-sm shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {m.imageUrl ? <img src={m.imageUrl} alt={m.name} className="h-11 w-11 object-contain" /> : <span className="text-[11px] font-bold">IMG</span>}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.id}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{brandMap[m.brandId] || m.brandId}</span>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{m.type}</span>
                          {m.year ? <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{m.year}</span> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted" onClick={() => loadModelForEdit(m.id)}>Edit</button>
                    <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50" onClick={() => safeCall(async () => { await catalogApi.deleteModel(m.id); await refresh(); setManageModelId(""); })}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-2xl bg-background p-5 shadow-card">
            <h2 className="mb-4 text-xl font-bold">Carousel Slides</h2>
            <form className="space-y-2" onSubmit={submitSlide}>
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="ID (optional)" value={slideForm.id} onChange={(e) => setSlideForm((s) => ({ ...s, id: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Slide title" value={slideForm.title} onChange={(e) => setSlideForm((s) => ({ ...s, title: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Slide subtitle" value={slideForm.sub} onChange={(e) => setSlideForm((s) => ({ ...s, sub: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Image URL" value={slideForm.imageUrl} onChange={(e) => setSlideForm((s) => ({ ...s, imageUrl: e.target.value }))} />
              <label className="block cursor-pointer rounded-lg border border-border px-3 py-2 text-sm">Upload slide image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e, (url) => setSlideForm((s) => ({ ...s, imageUrl: url })), "phoneservices/carousel-slides")} />
              </label>
              <button className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{editingSlideId ? "Update" : "Add"} Slide</button>
            </form>
            <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2 space-y-2">
              {(siteContent.carouselSlides || []).map((slide) => (
                <div key={slide.id} className="rounded-xl border border-border bg-background p-3 text-sm shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-24 shrink-0 rounded-lg bg-muted overflow-hidden">
                      {slide.imageUrl ? <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">{slide.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{slide.id}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{slide.sub}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted" onClick={() => editSlide(slide)}>Edit</button>
                    <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50" onClick={() => deleteSlide(slide.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-background p-5 shadow-card">
            <h2 className="mb-4 text-xl font-bold">Customer Feedback</h2>
            <form className="space-y-2" onSubmit={submitFeedback}>
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="ID (optional)" value={feedbackForm.id} onChange={(e) => setFeedbackForm((s) => ({ ...s, id: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Customer name" value={feedbackForm.name} onChange={(e) => setFeedbackForm((s) => ({ ...s, name: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Device" value={feedbackForm.device} onChange={(e) => setFeedbackForm((s) => ({ ...s, device: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Date text (ex: 2 days ago)" value={feedbackForm.date} onChange={(e) => setFeedbackForm((s) => ({ ...s, date: e.target.value }))} />
              <input className="w-full rounded-lg border border-border px-3 py-2" placeholder="Avatar initials (optional)" value={feedbackForm.avatar} onChange={(e) => setFeedbackForm((s) => ({ ...s, avatar: e.target.value }))} />
              <select className="w-full rounded-lg border border-border px-3 py-2" value={feedbackForm.rating} onChange={(e) => setFeedbackForm((s) => ({ ...s, rating: e.target.value }))}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={String(n)}>{n} stars</option>)}
              </select>
              <textarea className="w-full rounded-lg border border-border px-3 py-2" rows={4} placeholder="Feedback text" value={feedbackForm.text} onChange={(e) => setFeedbackForm((s) => ({ ...s, text: e.target.value }))} />
              <button className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{editingFeedbackId ? "Update" : "Add"} Feedback</button>
            </form>
            <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2 space-y-2">
              {(siteContent.customerFeedback || []).map((review) => (
                <div key={review.id} className="rounded-xl border border-border bg-background p-3 text-sm shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{review.name} ({review.rating}★)</div>
                      <div className="text-xs text-muted-foreground">{review.device} · {review.date}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{review.text}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted" onClick={() => editFeedback(review)}>Edit</button>
                    <button type="button" className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50" onClick={() => deleteFeedback(review.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <section className="rounded-2xl bg-background p-5 shadow-card">
            <h2 className="mb-4 text-xl font-bold">Users Management</h2>
            <form className="grid grid-cols-1 gap-2 md:grid-cols-4" onSubmit={submitAdminUser}>
              <input
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder="Admin email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm((s) => ({ ...s, email: e.target.value }))}
                disabled={!!editingUserEmail}
                required
              />
              <select
                className="w-full rounded-lg border border-border px-3 py-2"
                value={userForm.role}
                onChange={(e) => setUserForm((s) => ({ ...s, role: e.target.value }))}
              >
                <option value="editor">editor</option>
                <option value="superadmin">superadmin</option>
              </select>
              <input
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder={editingUserEmail ? "New password (optional)" : "Password"}
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm((s) => ({ ...s, password: e.target.value }))}
              />
              <button className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
                {editingUserEmail ? "Update User" : "Add User"}
              </button>
            </form>

            {editingUserEmail ? (
              <button
                type="button"
                className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                onClick={() => {
                  setEditingUserEmail("");
                  setUserForm({ email: "", role: "editor", password: "" });
                }}
              >
                Cancel Editing
              </button>
            ) : null}

            <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2 space-y-2">
              {adminUsers.map((user) => (
                <div key={user.email} className="rounded-xl border border-border bg-background p-3 text-sm shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{user.email}</div>
                      <div className="text-xs text-muted-foreground">Role: {user.role}</div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                      onClick={() => editAdminUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      onClick={() => deleteAdminUser(user.email)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;
