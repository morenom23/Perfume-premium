import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Boxes,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Filter,
  Flower2,
  ImagePlus,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
  WandSparkles,
  X,
  MessageCircle,
  ChartNoAxesCombined,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PerfumeBottle } from "./_shared/PerfumeBottle";
import {
  demoAudiences,
  demoBrands,
  demoCategories,
  demoProducts,
  formatCop,
} from "./_shared/demoProducts";
import type { DemoProduct } from "./_shared/demoProducts";
import "./_shared/theme.css";

type Page =
  | "Dashboard"
  | "Productos"
  | "Categorías / Marcas"
  | "Pedidos"
  | "Inventario"
  | "Ventas"
  | "Reportes"
  | "Usuarios / Permisos"
  | "Configuración comercial"
  | "Actividad / Auditoría";

const pages: { name: Page; icon: typeof LayoutDashboard; group: string }[] = [
  { name: "Dashboard", icon: LayoutDashboard, group: "GENERAL" },
  { name: "Productos", icon: Package, group: "CATÁLOGO" },
  { name: "Categorías / Marcas", icon: Tag, group: "CATÁLOGO" },
  { name: "Pedidos", icon: ShoppingBag, group: "OPERACIÓN" },
  { name: "Inventario", icon: Boxes, group: "OPERACIÓN" },
  { name: "Ventas", icon: Wallet, group: "ANÁLISIS" },
  { name: "Reportes", icon: ChartNoAxesCombined, group: "ANÁLISIS" },
  { name: "Usuarios / Permisos", icon: Users, group: "ADMINISTRACIÓN" },
  { name: "Configuración comercial", icon: Settings2, group: "ADMINISTRACIÓN" },
  { name: "Actividad / Auditoría", icon: Activity, group: "ADMINISTRACIÓN" },
];

const salesSeries = [
  { day: "01", amount: 22 },
  { day: "03", amount: 36 },
  { day: "05", amount: 29 },
  { day: "07", amount: 48 },
  { day: "09", amount: 40 },
  { day: "11", amount: 62 },
  { day: "13", amount: 49 },
  { day: "15", amount: 74 },
  { day: "17", amount: 57 },
  { day: "19", amount: 83 },
  { day: "21", amount: 68 },
  { day: "23", amount: 93 },
  { day: "25", amount: 74 },
  { day: "27", amount: 105 },
  { day: "29", amount: 88 },
];
const categorySeries = [
  { name: "Oriental", value: 32 },
  { name: "Floral", value: 26 },
  { name: "Fresca", value: 21 },
  { name: "Madera", value: 15 },
  { name: "Otras", value: 9 },
];
const orderLabels = [
  "Pendiente",
  "Confirmado",
  "Pagado",
  "Enviado",
  "Entregado",
  "Cancelado",
] as const;
const demoOrders = [
  {
    id: "DEMO-0481",
    person: "Valentina R.",
    products: "Noche Violeta · 100 ml",
    amount: 189000,
    status: "Pendiente",
  },
  {
    id: "DEMO-0479",
    person: "Santiago M.",
    products: "Luz Mineral · 75 ml",
    amount: 154000,
    status: "Confirmado",
  },
  {
    id: "DEMO-0476",
    person: "Camila P.",
    products: "Jardín Eléctrico · 100 ml",
    amount: 172000,
    status: "Enviado",
  },
  {
    id: "DEMO-0472",
    person: "Martín G.",
    products: "Madera Líquida · 100 ml",
    amount: 216000,
    status: "Entregado",
  },
  {
    id: "DEMO-0468",
    person: "Isabella C.",
    products: "Ámbar de Medianoche · 100 ml",
    amount: 228000,
    status: "Pagado",
  },
];
const formatCompact = (value: number) => `${value} M`;

function DemoTag({ children = "DEMO · ilustrativo" }: { children?: string }) {
  return <span className="ad-demo-tag">{children}</span>;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="ad-section-heading">
      <div>
        <div className="ad-eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  icon: Icon,
  accent = "violet",
}: {
  label: string;
  value: string;
  delta: string;
  icon: typeof TrendingUp;
  accent?: string;
}) {
  return (
    <article className={`ad-metric ad-${accent}`}>
      <div className="ad-metric-top">
        <span>{label}</span>
        <Icon size={17} strokeWidth={1.7} />
      </div>
      <strong>{value}</strong>
      <div className="ad-metric-bottom">
        <span>
          <ArrowUpRight size={13} /> {delta}
        </span>
        <DemoTag />
      </div>
    </article>
  );
}

function ProductThumb({
  product,
  size = "normal",
}: {
  product: DemoProduct;
  size?: "normal" | "small";
}) {
  return (
    <div
      className={`ad-product-thumb ${size}`}
      style={{ "--tone": product.tone } as CSSProperties}
    >
      <PerfumeBottle tone={product.tone} label={product.name} />
    </div>
  );
}

export function Admin({
  initialLogin = false,
  onExit,
}: { initialLogin?: boolean; onExit?: () => void } = {}) {
  const [page, setPage] = useState<Page>("Dashboard");
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [mobileNav, setMobileNav] = useState(false);
  const [loginView, setLoginView] = useState(() => {
    return initialLogin ? !localStorage.getItem("admin_session") : false;
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas las familias");
  const [galleryProduct, setGalleryProduct] = useState<DemoProduct | null>(
    null,
  );
  const [galleryViews, setGalleryViews] = useState([0, 1, 2, 3]);
  const [principalView, setPrincipalView] = useState(0);
  const [toast, setToast] = useState("");
  const [secondaryActive, setSecondaryActive] = useState(true);
  const [showInventory, setShowInventory] = useState(false);
  const [orderFilter, setOrderFilter] = useState("Todos los estados");
  const [reportNotice, setReportNotice] = useState(false);
  const [period, setPeriod] = useState("Últimos 30 días");
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setDbProducts(data))
      .catch((err) => console.error("Error cargando productos en admin", err));
  }, []);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setDbOrders(data))
      .catch((err) => console.error("Error cargando pedidos", err));
  }, []);

  const filteredProducts = useMemo(
    () =>
      dbProducts.filter((product) => {
        const matchesSearch =
          `${product.name} ${product.reference} ${product.brand} ${product.audience} ${product.category}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return (
          matchesSearch &&
          (category === "Todas las familias" || product.category === category)
        );
      }),
    [search, category, dbProducts],
  );

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const go = (next: Page) => {
    setPage(next);
    setMobileNav(false);
    setSearch("");
  };

  const openGallery = (product: DemoProduct) => {
    setGalleryProduct(product);
    setGalleryViews([0, 1, 2, 3]);
    setPrincipalView(0);
  };

  const removeGalleryView = (index: number) => {
    setGalleryViews((views) => views.filter((_, i) => i !== index));
    setPrincipalView((current) =>
      current === index
        ? Math.max(0, Math.min(index, galleryViews.length - 2))
        : current > index
          ? current - 1
          : current,
    );
  };
  const moveGalleryView = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= galleryViews.length) return;
    setGalleryViews((views) => {
      const next = [...views];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setPrincipalView((current) =>
      current === index ? target : current === target ? index : current,
    );
  };
  const addGalleryView = () => {
    if (galleryViews.length >= 4) return;
    const nextView = [0, 1, 2, 3].find((view) => !galleryViews.includes(view));
    if (nextView !== undefined)
      setGalleryViews((views) => [...views, nextView]);
  };

  /*PARA EL ADMIN REAL-------------------------*/
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      // Aquí conectaremos con la base de datos real después
      // Por ahora, validamos con los datos que creamos en Neon manualmente
      if (email === "admin@tuperfumeria.com" && password === "Admin123!") {
        localStorage.setItem("admin_session", "true");
        setLoginView(false);
      } else {
        setLoginError("Credenciales incorrectas. Intenta de nuevo.");
      }
    } catch (error) {
      setLoginError("Error de conexión.");
    } finally {
      setIsLoading(false);
    }
  };
  /*--------------------FIN ADMIN REAL---------------------*/

  const orders = dbOrders;
  const navGroups = [...new Set(pages.map((item) => item.group))];

  /*if (loginView) {
    return <div className="tp-root ad-root ad-login-screen">
      <style>{styles}</style>
      <div className="ad-login-art"><div className="ad-login-orbit orbit-one" /><div className="ad-login-orbit orbit-two" />
        <div className="ad-login-perfume"><PerfumeBottle tone="#9d70dd" label="NOCTURNE" /></div>
        <div className="ad-login-caption"><span>CASA DE FRAGANCIAS · COLOMBIA</span><b>La belleza vive<br />en los detalles.</b><small>Panel privado de demostración · Fase 1</small></div>
      </div>
      <div className="ad-login-panel"><button className="ad-login-back" onClick={() => onExit ? onExit() : setLoginView(false)}><ChevronLeft size={16} /> {onExit ? "Volver a la tienda" : "Volver al panel"}</button>
        <div className="ad-brand-mark"><span className="ad-brand-icon"><Flower2 size={21} /></span><div><b>Tu Perfumería</b><small>ADMINISTRACIÓN</small></div></div>
        <div className="ad-login-copy"><span className="ad-eyebrow">ACCESO DE DEMOSTRACIÓN</span><h1>Una vista privada,<br /><i>sin credenciales.</i></h1><p>Este prototipo no utiliza autenticación ni guarda información. Ingresa a la experiencia visual con un solo paso.</p></div>
        <button className="ad-primary ad-login-enter" onClick={() => setLoginView(false)}>Entrar a vista demo <ChevronRight size={17} /></button>
        <div className="ad-login-safety"><ShieldCheck size={15} /><span>Modo visual · sin conexión · sin datos reales</span></div>
        <div className="ad-login-foot">TU PERFUMERÍA <span>·</span> PROTOTIPO FASE 1</div>
      </div>
    </div>;
  }*/
  if (loginView) {
    return (
      <div className="tp-root ad-root ad-login-screen">
        <style>{styles}</style>
        <div className="ad-login-art">
          <div className="ad-login-orbit orbit-one" />
          <div className="ad-login-orbit orbit-two" />
          <div className="ad-login-perfume">
            <PerfumeBottle tone="#9d70dd" label="NOCTURNE" />
          </div>
          <div className="ad-login-caption">
            <span>CASA DE FRAGANCIAS · COLOMBIA</span>
            <b>
              La belleza vive
              <br />
              en los detalles.
            </b>
            <small>Panel administrativo privado</small>
          </div>
        </div>
        <div className="ad-login-panel">
          <button
            className="ad-login-back"
            onClick={() => (onExit ? onExit() : setLoginView(false))}
          >
            <ChevronLeft size={16} />{" "}
            {onExit ? "Volver a la tienda" : "Volver al panel"}
          </button>
          <div className="ad-brand-mark">
            <span className="ad-brand-icon">
              <Flower2 size={21} />
            </span>
            <div>
              <b>Tu Perfumería</b>
              <small>ADMINISTRACIÓN</small>
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>
              Iniciar Sesión
            </h1>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#d8c495",
                  marginBottom: "5px",
                }}
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#1b1821",
                  border: "1px solid #39333f",
                  color: "#fff",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#d8c495",
                  marginBottom: "5px",
                }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#1b1821",
                  border: "1px solid #39333f",
                  color: "#fff",
                  borderRadius: "4px",
                }}
              />
            </div>

            {loginError && (
              <p style={{ color: "#ff6b6b", fontSize: "12px" }}>{loginError}</p>
            )}

            <button
              type="submit"
              className="ad-primary"
              disabled={isLoading}
              style={{ marginTop: "10px" }}
            >
              {isLoading ? "Entrando..." : "Entrar al Panel"}{" "}
              <ChevronRight size={17} />
            </button>
          </form>

          <div className="ad-login-safety" style={{ marginTop: "20px" }}>
            <ShieldCheck size={15} />
            <span>Sesión segura · Base de datos conectada</span>
          </div>
          <div className="ad-login-foot">
            TU PERFUMERÍA <span>·</span> ADMINISTRACIÓN
          </div>
        </div>
      </div>
    );
  }
  /*---------PARTE DEL ADMIN REAL---------------------- */

  return (
    <div className="tp-root ad-root">
      <style>{styles}</style>
      <div className="ad-shell">
        {mobileNav && (
          <button
            className="ad-mobile-scrim"
            aria-label="Cerrar navegación"
            onClick={() => setMobileNav(false)}
          />
        )}
        <aside className={`ad-sidebar ${mobileNav ? "is-open" : ""}`}>
          <div className="ad-brand">
            <div className="ad-brand-icon">
              <Flower2 size={21} strokeWidth={1.5} />
            </div>
            <div className="ad-brand-name">
              <b>Tu Perfumería</b>
              <span>ESTUDIO DE FRAGANCIAS</span>
            </div>
            <button
              className="ad-close-nav"
              aria-label="Cerrar menú"
              onClick={() => setMobileNav(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="ad-store-switch">
            <span className="ad-store-glyph">TP</span>
            <span>
              <b>Casa principal</b>
              <small>Colombia · DEMO</small>
            </span>
            <ChevronDown size={14} />
          </div>
          <nav className="ad-nav">
            {navGroups.map((group) => (
              <div className="ad-nav-group" key={group}>
                <span className="ad-nav-label">{group}</span>
                {pages
                  .filter((item) => item.group === group)
                  .map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      onClick={() => go(name)}
                      className={`ad-nav-link ${page === name ? "active" : ""}`}
                    >
                      <Icon size={16} strokeWidth={1.7} />
                      <span>{name}</span>
                      {name === "Pedidos" && <b className="ad-nav-count">05</b>}
                    </button>
                  ))}
              </div>
            ))}
          </nav>
          <div className="ad-sidebar-bottom">
            <div className="ad-stage-card">
              <div className="ad-stage-mark">
                <Sparkles size={14} />
              </div>
              <span>
                <b>Experiencia de muestra</b>
                <small>Fase 1 · solo visual</small>
              </span>
              <span className="ad-live-dot" />
            </div>
            <button
              className="ad-profile"
              onClick={() => {
                localStorage.removeItem("admin_session");
                setLoginView(true);
              }}
            >
              <span className="ad-avatar">AM</span>
              <span>
                <b>Adriana M.</b>
                <small>Administradora DEMO</small>
              </span>
              <MoreHorizontal size={18} />
            </button>
          </div>
        </aside>
        <main className="ad-main">
          <header className="ad-topbar">
            <div className="ad-top-left">
              <button
                className="ad-menu-trigger"
                aria-label="Abrir menú"
                onClick={() => setMobileNav(true)}
              >
                <Menu size={20} />
              </button>
              <div className="ad-breadcrumb">
                Administración <ChevronRight size={14} /> <b>{page}</b>
              </div>
            </div>
            <div className="ad-top-actions">
              <div className="ad-mode-chip">
                <span /> DEMO VISUAL <b>FASE 1</b>
              </div>
              <button
                className="ad-icon-button"
                aria-label="Ayuda"
                onClick={() =>
                  notify(
                    "Este panel es una experiencia visual de demostración.",
                  )
                }
              >
                <CircleHelp size={17} />
              </button>
              <button
                className="ad-icon-button ad-notice"
                aria-label="Notificaciones de demostración"
                onClick={() => go("Actividad / Auditoría")}
              >
                <Bell size={17} />
                <i />
              </button>
              <button
                className="ad-user-chip"
                onClick={() => setLoginView(true)}
              >
                <span className="ad-avatar">AM</span>
                <span>Adriana M.</span>
                <ChevronDown size={13} />
              </button>
            </div>
          </header>
          <div className="ad-content">
            <div className="ad-demo-banner">
              <span className="ad-banner-symbol">
                <WandSparkles size={15} />
              </span>
              <span>
                <b>Espacio de demostración.</b> Todas las cifras, productos y
                registros son ilustrativos; no representan operaciones reales ni
                se guardan.
              </span>
              <button
                aria-label="Ir a configuración demo"
                onClick={() => go("Configuración comercial")}
              >
                <span>Sobre este demo</span>
                <ChevronRight size={15} />
              </button>
            </div>
            {page === "Dashboard" && (
              <Dashboard
                period={period}
                setPeriod={setPeriod}
                go={go}
                notify={notify}
              />
            )}
            {page === "Productos" && (
              <Products
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                products={filteredProducts}
                openGallery={openGallery}
                notify={notify}
              />
            )}
            {page === "Categorías / Marcas" && (
              <Categories go={go} notify={notify} />
            )}
            {page === "Pedidos" && (
              <Orders
                orders={orders}
                orderFilter={orderFilter}
                setOrderFilter={setOrderFilter}
                notify={notify}
                setSelectedOrder={setSelectedOrder}
              />
            )}
            {page === "Inventario" && (
              <Inventory
                showInventory={showInventory}
                setShowInventory={setShowInventory}
                notify={notify}
              />
            )}
            {page === "Ventas" && (
              <Sales period={period} setPeriod={setPeriod} notify={notify} />
            )}
            {page === "Reportes" && (
              <Reports
                notify={notify}
                reportNotice={reportNotice}
                setReportNotice={setReportNotice}
                dbOrders={dbOrders}
              />
            )}
            {page === "Usuarios / Permisos" && (
              <UsersPage
                active={secondaryActive}
                setActive={setSecondaryActive}
                notify={notify}
              />
            )}
            {page === "Configuración comercial" && <Settings notify={notify} />}
            {page === "Actividad / Auditoría" && <ActivityPage />}
            <footer className="ad-footer">
              <span>
                Tu Perfumería <i>·</i> Panel privado de demostración
              </span>
              <span>
                FASE 1 <i>·</i> SIN DATOS REALES
              </span>
            </footer>
          </div>
        </main>
      </div>
      {galleryProduct && (
        <GalleryModal
          product={galleryProduct}
          views={galleryViews}
          principalView={principalView}
          setPrincipalView={setPrincipalView}
          close={() => setGalleryProduct(null)}
          add={addGalleryView}
          remove={removeGalleryView}
          move={moveGalleryView}
        />
      )}

      {toast && (
        <div role="status" className="ad-toast">
          <Check size={16} /> {toast}
        </div>
      )}
      {selectedOrder && (
        <div
          className="ad-editor-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <section
            className="ad-editor-card"
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: "500px" }}
          >
            <header className="ad-editor-heading">
              <div>
                <span className="ad-eyebrow">DETALLE DEL PEDIDO</span>
                <h2>{selectedOrder.orderNumber}</h2>
              </div>
              <button
                className="ad-row-action"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={17} />
              </button>
            </header>
            <div style={{ padding: "20px", color: "#eee9e1" }}>
              <p>
                <strong>Cliente:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedOrder.customerPhone}
              </p>
              <p>
                <strong>Dirección:</strong> {selectedOrder.customerAddress},{" "}
                {selectedOrder.customerCity}
              </p>
              <p>
                <strong>Método de Pago:</strong> {selectedOrder.paymentMethod}
              </p>

              <div
                style={{
                  marginTop: "20px",
                  borderTop: "1px solid #333",
                  paddingTop: "10px",
                }}
              >
                <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>
                  Cambiar Estado:
                </h3>
                <select
                  value={selectedOrder.status}
                  onChange={async (e) => {
                    const nuevoEstado = e.target.value;
                    try {
                      const res = await fetch(
                        `/api/orders/${selectedOrder.id}/status`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: nuevoEstado }),
                        },
                      );
                      if (res.ok) {
                        setSelectedOrder({
                          ...selectedOrder,
                          status: nuevoEstado,
                        });
                        setDbOrders(
                          dbOrders.map((o) =>
                            o.id === selectedOrder.id
                              ? { ...o, status: nuevoEstado }
                              : o,
                          ),
                        );
                        alert("Estado actualizado");
                      } else {
                        alert("Error al actualizar el estado");
                      }
                    } catch (err) {
                      alert("Error de conexión");
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#1b1821",
                    color: "#fff",
                    border: "1px solid #39333f",
                    borderRadius: "4px",
                  }}
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="paid">Pagado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
  /*---------------------------------ORDER-----------------------------*/
}

function Dashboard({
  period,
  setPeriod,
  go,
  notify,
}: {
  period: string;
  setPeriod: (v: string) => void;
  go: (p: Page) => void;
  notify: (s: string) => void;
}) {
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="MARTES, 18 DE JUNIO · VISTA GENERAL"
        title="Buenos días, Adriana"
        description="Un pulso de muestra para la casa de fragancias."
        action={
          <div className="ad-heading-actions">
            <select
              aria-label="Periodo ilustrativo"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Últimos 30 días</option>
              <option>Últimos 7 días</option>
              <option>Este año</option>
            </select>
            <button
              className="ad-outline"
              onClick={() =>
                notify(
                  "El informe es únicamente ilustrativo; no se descargó ningún archivo.",
                )
              }
            >
              <Download size={15} /> Exportar vista
            </button>
          </div>
        }
      />
      <div className="ad-metrics">
        <Metric
          label="Ventas ilustrativas"
          value="$ 8,42 M"
          delta="+12,8% vs. periodo anterior"
          icon={Wallet}
        />
        <Metric
          label="Pedidos de muestra"
          value="128"
          delta="+8,2% vs. periodo anterior"
          icon={ShoppingBag}
          accent="gold"
        />
        <Metric
          label="Ticket promedio"
          value="$ 65.781"
          delta="+3,4% vs. periodo anterior"
          icon={CreditCard}
          accent="rose"
        />
        <Metric
          label="Unidades en catálogo"
          value="81"
          delta="12 referencias demo"
          icon={Package}
          accent="green"
        />
      </div>
      <div className="ad-dashboard-grid">
        <section className="ad-panel ad-sales-panel">
          <div className="ad-panel-heading">
            <div>
              <span className="ad-eyebrow">
                RITMO DE LA CASA <DemoTag />
              </span>
              <h2>Ventas de demostración</h2>
              <p>Valores ficticios · miles de COP</p>
            </div>
            <button className="ad-text-link" onClick={() => go("Ventas")}>
              Ver análisis <ChevronRight size={14} />
            </button>
          </div>
          <div className="ad-chart-key">
            <span>
              <i /> Valor ilustrativo
            </span>
            <span className="ad-chart-period">{period}</span>
          </div>
          <div className="ad-line-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesSeries}
                margin={{ top: 14, right: 8, left: -17, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="adminChartFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#a985ef" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#a985ef" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(226,216,197,.07)"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8e8994", fontSize: 10 }}
                  tickMargin={11}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8e8994", fontSize: 10 }}
                  tickFormatter={formatCompact}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1c1921",
                    border: "1px solid rgba(214,190,139,.23)",
                    borderRadius: 8,
                    color: "#f3eee6",
                    fontSize: 12,
                  }}
                  formatter={(value) => [
                    `$${value} mil COP · DEMO`,
                    "Valor ilustrativo",
                  ]}
                  labelFormatter={(label) => `Día ${label} · datos demo`}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#b99af7"
                  strokeWidth={2.5}
                  fill="url(#adminChartFill)"
                  activeDot={{
                    r: 4,
                    fill: "#d6be8b",
                    stroke: "#1c1921",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="ad-panel ad-category-panel">
          <div className="ad-panel-heading">
            <div>
              <span className="ad-eyebrow">
                PERFIL OLFATIVO <DemoTag />
              </span>
              <h2>Interés por familia</h2>
              <p>Composición ilustrativa · no ventas reales</p>
            </div>
            <button
              className="ad-square-button"
              aria-label="Más detalles de categorías"
              onClick={() => go("Categorías / Marcas")}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="ad-bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySeries}
                layout="vertical"
                margin={{ top: 5, right: 26, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(226,216,197,.06)"
                  horizontal={false}
                />
                <XAxis type="number" hide domain={[0, 36]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#b9b3bf", fontSize: 11 }}
                  width={74}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,.025)" }}
                  contentStyle={{
                    background: "#1c1921",
                    border: "1px solid rgba(214,190,139,.23)",
                    borderRadius: 8,
                    color: "#f3eee6",
                    fontSize: 12,
                  }}
                  formatter={(value) => [
                    `${value}% · DEMO`,
                    "Distribución ficticia",
                  ]}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                  fill="#9270c7"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <button className="ad-panel-footlink" onClick={() => go("Productos")}>
            Explorar catálogo <ChevronRight size={14} />
          </button>
        </section>
      </div>
      <div className="ad-lower-grid">
        <section className="ad-panel ad-recent-panel">
          <div className="ad-panel-heading">
            <div>
              <span className="ad-eyebrow">
                ACTIVIDAD RECIENTE <DemoTag />
              </span>
              <h2>Pedidos de muestra</h2>
              <p>Registros enteramente ficticios</p>
            </div>
            <button className="ad-text-link" onClick={() => go("Pedidos")}>
              Todos los pedidos <ChevronRight size={14} />
            </button>
          </div>
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>REFERENCIA DEMO</th>
                  <th>CLIENTE FICTICIO</th>
                  <th>PRODUCTO ILUSTRATIVO</th>
                  <th>ESTADO</th>
                  <th>VALOR DEMO</th>
                </tr>
              </thead>
              <tbody>
                {demoOrders.slice(0, 3).map((order) => (
                  <tr key={order.id}>
                    <td className="ad-mono">{order.id}</td>
                    <td>{order.person}</td>
                    <td>{order.products}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>{formatCop(order.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="ad-stock-card">
          <div className="ad-stock-orb" />
          <div className="ad-stock-top">
            <span className="ad-eyebrow">SEÑAL DEL CATÁLOGO</span>
            <Boxes size={17} />
          </div>
          <div className="ad-stock-num">
            03 <span>referencias</span>
          </div>
          <p>Inventario bajo en esta muestra ficticia.</p>
          <div className="ad-stock-bottom">
            <span>DEMO · no representa existencias reales</span>
            <button onClick={() => go("Inventario")}>
              Revisar <ChevronRight size={13} />
            </button>
          </div>
        </section>
      </div>
      <div className="ad-note-strip">
        <Sparkles size={14} />
        <span>
          Este tablero es una composición de datos ficticios para revisión
          visual. Ningún valor representa ventas u operaciones reales.
        </span>
        <button onClick={() => go("Configuración comercial")}>
          Revisar avisos
        </button>
      </div>
    </div>
  );
}

function Products({
  search,
  setSearch,
  category,
  setCategory,
  products,
  openGallery,
  notify,
}: {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  products: DemoProduct[];
  openGallery: (p: DemoProduct) => void;
  notify: (s: string) => void;
}) {
  const [editorProduct, setEditorProduct] = useState<
    DemoProduct | "new" | null
  >(null);
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="CATÁLOGO · 12 REFERENCIAS FICTICIAS"
        title="Productos"
        description="Una vitrina de muestra, lista para explorar. Los cambios solo viven en esta sesión."
        action={
          <button
            className="ad-primary"
            onClick={() => setEditorProduct("new")}
          >
            <Plus size={16} /> Nuevo producto{" "}
            <span className="ad-mini-demo">DEMO</span>
          </button>
        }
      />
      <div className="ad-catalog-toolbar">
        <label className="ad-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, referencia o familia..."
          />
          <kbd>⌘ K</kbd>
        </label>
        <div className="ad-filter-group">
          <SlidersHorizontal size={15} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filtrar por familia"
          >
            {demoCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <span className="ad-result-count">{products.length} resultados</span>
        </div>
      </div>
      <div className="ad-product-layout">
        <section className="ad-product-table-panel">
          <div className="ad-table-caption">
            <div>
              <b>Catálogo de muestra</b>
              <small>
                Los doce productos son demo; ningún dato es comercial.
              </small>
            </div>
            <DemoTag />
          </div>
          <div className="ad-table-wrap">
            <table className="ad-table ad-products-table">
              <thead>
                <tr>
                  <th>PRODUCTO DEMO</th>
                  <th>FAMILIA</th>
                  <th>¿PARA QUIÉN?</th>
                  <th>PRECIO ILUSTRATIVO</th>
                  <th>STOCK DEMO</th>
                  <th>ESTADO DEMO</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="ad-product-cell">
                        <ProductThumb product={product} size="small" />
                        <span>
                          <b>{product.name}</b>
                          <small>
                            {product.reference} · {product.brand}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <span className="ad-audience-pill">
                        {product.audience}
                      </span>
                    </td>
                    <td>{formatCop(product.price)}</td>
                    <td>
                      <span
                        className={`ad-stock-value ${product.stock < 5 ? "low" : ""}`}
                      >
                        {String(product.stock).padStart(2, "0")}{" "}
                        <small>uds.</small>
                      </span>
                    </td>
                    <td>
                      <span
                        className={`ad-product-status ${product.stock ? "" : "unavailable"}`}
                      >
                        <i />
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="ad-product-actions">
                        <button
                          className="ad-row-action"
                          aria-label={`Editar ${product.name}`}
                          onClick={() => setEditorProduct(product)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="ad-row-action"
                          aria-label={`Gestionar galería de ${product.name}`}
                          onClick={() => openGallery(product)}
                        >
                          <ImagePlus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="ad-empty">
                        <Search size={20} />
                        <b>Sin coincidencias</b>
                        <span>Prueba otro término o familia.</span>
                        <button
                          onClick={() => {
                            setSearch("");
                            setCategory("Todas las familias");
                          }}
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="ad-table-end">
            Mostrando {products.length} de 12 productos <span>·</span> DEMO ·
            datos ilustrativos
          </div>
        </section>
        <aside className="ad-catalog-aside">
          <div className="ad-catalog-art">
            <div className="ad-catalog-art-glow" />
            <PerfumeBottle tone="#a37be0" label="NOCTURNE" />
            <span className="ad-art-stamp">
              ESSENCE
              <br />
              DEMO 01
            </span>
          </div>
          <div className="ad-aside-copy">
            <span className="ad-eyebrow">CURADURÍA VISUAL</span>
            <h3>
              Una colección
              <br />
              para descubrir.
            </h3>
            <p>
              La gestión de imágenes admite cuatro vistas temporales por
              producto. Nada se guarda al salir.
            </p>
            <button onClick={() => openGallery(demoProducts[0])}>
              Abrir galería de muestra <ChevronRight size={14} />
            </button>
          </div>
          <div className="ad-aside-foot">
            <span>12</span>
            <div>
              <b>fragancias de muestra</b>
              <small>Todos los nombres y valores son ficticios.</small>
            </div>
          </div>
        </aside>
      </div>
      {editorProduct && (
        <ProductEditor
          product={editorProduct === "new" ? undefined : editorProduct}
          close={() => setEditorProduct(null)}
          notify={notify}
        />
      )}
    </div>
  );
}

function ProductEditor({
  product,
  close,
  notify,
}: {
  product?: DemoProduct;
  close: () => void;
  notify: (message: string) => void;
}) {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const newProduct = {
      name: formData.get("name"),
      reference: formData.get("reference"),
      brand: formData.get("brand"),
      category: formData.get("category"),
      audience: formData.get("audience"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      size: formData.get("size"),
      status: "published",
      isFeatured: false,
    };

    try {
      // AQUÍ VAN LAS DOS LÍNEAS NUEVAS:
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";

      // Y AQUÍ VA EL FETCH (ya modificado):
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        alert("¡Producto guardado exitosamente en la base de datos!");
        close();
        window.location.reload();
      } else {
        alert("Error al guardar el producto.");
      }
    } catch (err) {
      alert("Error de conexión.");
    }
  };

  return (
    <div
      className="ad-editor-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        className="ad-editor-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-editor-title"
      >
        <header className="ad-editor-heading">
          <div>
            <span className="ad-eyebrow">PRODUCTO · VISTA DE DEMOSTRACIÓN</span>
            <h2 id="ad-editor-title">
              {product ? "Editar producto" : "Crear producto"}
            </h2>
          </div>
          <DemoTag />
          <button
            className="ad-row-action"
            onClick={close}
            aria-label="Cerrar formulario"
          >
            <X size={17} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="ad-editor-grid">
            <label>
              Nombre ficticio
              <input
                name="name"
                defaultValue={product?.name ?? ""}
                placeholder="Nombre de demostración"
                required
              />
            </label>
            <label>
              Referencia demo
              <input
                name="reference"
                defaultValue={product?.reference ?? "DEMO-NUEVO"}
                required
              />
            </label>
            <label>
              Marca ficticia
              <select
                name="brand"
                defaultValue={product?.brand ?? demoBrands[0]}
              >
                {demoBrands.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Familia olfativa
              <select
                name="category"
                defaultValue={product?.category ?? demoCategories[1]}
              >
                {demoCategories.slice(1).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              ¿Para quién?
              <select
                name="audience"
                defaultValue={product?.audience ?? "Unisex"}
              >
                {demoAudiences
                  .filter((item) => item !== "Todos")
                  .map((item) => (
                    <option key={item}>{item}</option>
                  ))}
              </select>
            </label>
            <label>
              Precio ficticio (COP)
              <input
                name="price"
                type="number"
                min="0"
                defaultValue={product?.price ?? ""}
                placeholder="0"
                required
              />
            </label>
            <label>
              Unidades DEMO
              <input
                name="stock"
                type="number"
                min="0"
                defaultValue={product?.stock ?? ""}
                placeholder="0"
                required
              />
            </label>
            <label>
              Contenido de muestra
              <input name="size" defaultValue={product?.size ?? "100 ml"} />
            </label>
          </div>
          <p className="ad-editor-disclaimer">
            <ShieldCheck size={14} /> Vista previa solamente. No se crea ni
            modifica ningún producto.
          </p>
          <div className="ad-editor-actions">
            <button type="button" className="ad-outline" onClick={close}>
              Cancelar
            </button>
            <button type="submit" className="ad-primary">
              <Check size={15} /> Guardar Producto
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Categories({
  go,
  notify,
}: {
  go: (p: Page) => void;
  notify: (s: string) => void;
}) {
  const familyCopy: Record<string, string> = {
    Amaderada: "Maderas pulidas, resinas y matices verdes.",
    Cítrica: "Acordes luminosos con salida vibrante.",
    Dulce: "Texturas suaves y envolventes.",
    Floral: "Pétalos de carácter contemporáneo.",
    Fresca: "Composiciones limpias y aireadas.",
    Oriental: "Especias, ámbar y profundidad.",
  };
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="ORGANIZACIÓN DEL CATÁLOGO · DEMO"
        title="Categorías / Marcas"
        description="Familias olfativas y sellos ficticios para ordenar la colección."
        action={
          <button
            className="ad-primary"
            onClick={() =>
              notify("Esta acción es solo visual; no se guardaron cambios.")
            }
          >
            <Plus size={16} /> Nueva categoría
          </button>
        }
      />
      <div className="ad-category-intro">
        <div className="ad-category-orbit">
          <Flower2 size={28} />
        </div>
        <div>
          <span className="ad-eyebrow">MAPA OLFATIVO · DATOS ILUSTRATIVOS</span>
          <h2>Seis familias, doce historias.</h2>
          <p>
            Taxonomía de demostración · no representa marcas comerciales
            disponibles.
          </p>
        </div>
        <DemoTag />
      </div>
      <div className="ad-family-grid">
        {demoCategories.slice(1).map((family, index) => (
          <article
            className="ad-family-card"
            key={family}
            style={{ "--family-index": index } as CSSProperties}
          >
            <span className="ad-family-count">0{index + 1}</span>
            <span className="ad-family-icon">
              <Flower2 size={19} />
            </span>
            <h3>{family}</h3>
            <p>{familyCopy[family]}</p>
            <div className="ad-family-bottom">
              <span>
                {demoProducts.filter((p) => p.category === family).length}{" "}
                referencias DEMO
              </span>
              <button
                onClick={() => go("Productos")}
                aria-label={`Ver productos de ${family}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <section className="ad-panel ad-brand-panel">
        <div className="ad-panel-heading">
          <div>
            <span className="ad-eyebrow">MARCAS DE EJEMPLO</span>
            <h2>Firmas que viven en esta maqueta</h2>
            <p>
              Nombres inventados para ambientar el catálogo. Sin relación
              comercial.
            </p>
          </div>
          <DemoTag />
        </div>
        <div className="ad-brands-row">
          {[
            "Atelier Niebla",
            "Orbe Parfums",
            "Casa Sillage",
            "Lumen No. 4",
          ].map((brand, i) => (
            <div key={brand} className="ad-brand-sample">
              <span className="ad-brand-monogram">
                {["AN", "OP", "CS", "L4"][i]}
              </span>
              <span>
                <b>{brand}</b>
                <small>MARCA FICTICIA · DEMO</small>
              </span>
              <span className="ad-brand-kind">Sello de muestra</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusClass: Record<string, string> = {
    Pendiente: "pending",
    Confirmado: "confirmed",
    Pagado: "paid",
    Enviado: "shipped",
    Entregado: "delivered",
    Cancelado: "cancelled",
  };
  return (
    <span className={`ad-order-status ${statusClass[status] || ""}`}>
      <i />
      {status}
    </span>
  );
}

function Orders({
  orders,
  orderFilter,
  setOrderFilter,
  notify,
  setSelectedOrder,
}: {
  orders: any[];
  orderFilter: string;
  setOrderFilter: (v: string) => void;
  notify: (m: string) => void;
  setSelectedOrder: (o: any) => void;
}) {
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="OPERACIÓN · REGISTROS FICTICIOS"
        title="Pedidos"
        description="Una bandeja ilustrativa para revisar jerarquías y estados."
        action={
          <button
            className="ad-outline"
            onClick={() =>
              notify(
                "Los datos de esta tabla son ficticios; no hay pedidos reales.",
              )
            }
          >
            <Filter size={15} /> Filtros demo
          </button>
        }
      />
      <div className="ad-order-summary">
        <div>
          <span>EN LA MUESTRA</span>
          <b>05</b>
          <small>pedidos ficticios</small>
        </div>
        <div>
          <span>PENDIENTES</span>
          <b>01</b>
          <small>registros demo</small>
        </div>
        <div>
          <span>VALOR ILUSTRATIVO</span>
          <b>$ 959.000</b>
          <small>no son ventas reales</small>
        </div>
        <div className="ad-order-summary-message">
          <ClipboardList size={19} />
          <span>
            Los estados son los seis aprobados y pertenecen únicamente a esta
            vista ilustrativa.
          </span>
          <DemoTag />
        </div>
      </div>
      <section className="ad-panel ad-order-panel">
        <div className="ad-order-tools">
          <div>
            <span className="ad-eyebrow">PEDIDOS RECIENTES</span>
            <h2>
              Actividad de muestra <DemoTag />
            </h2>
          </div>
          <select
            aria-label="Filtrar pedidos por estado"
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
          >
            <option>Todos los estados</option>
            {orderLabels.map((label) => (
              <option key={label}>{label}</option>
            ))}
          </select>
        </div>

        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>NÚMERO PEDIDO</th>
                <th>CLIENTE</th>
                <th>DETALLE</th>
                <th>ESTADO</th>
                <th>VALOR</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="ad-mono">{order.orderNumber}</td>
                  <td>
                    <b>{order.customerName}</b>
                    <small className="ad-cell-sub">{order.customerPhone}</small>
                  </td>
                  <td>
                    {order.items && order.items.length > 0
                      ? `${order.items[0].quantity}x ${order.items[0].productName} ${order.items.length > 1 ? `(+${order.items.length - 1} más)` : ""}`
                      : "Sin detalle"}
                  </td>
                  <td>
                    <StatusBadge
                      status={
                        order.status === "pending"
                          ? "Pendiente"
                          : order.status === "confirmed"
                            ? "Confirmado"
                            : order.status === "paid"
                              ? "Pagado"
                              : order.status === "shipped"
                                ? "Enviado"
                                : order.status === "delivered"
                                  ? "Entregado"
                                  : order.status === "cancelled"
                                    ? "Cancelado"
                                    : order.status
                      }
                    />
                  </td>
                  <td>{formatCop(order.subtotal)}</td>
                  <td>
                    <button
                      className="ad-row-action"
                      aria-label={`Ver detalle ${order.orderNumber}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="ad-empty">
                      No hay pedidos registrados todavía.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ad-table-end">
          Registros ficticios <span>·</span> DEMO · datos ilustrativos; no son
          ventas reales
        </div>
      </section>
    </div>
  );
}

function Inventory({
  showInventory,
  setShowInventory,
  notify,
}: {
  showInventory: boolean;
  setShowInventory: (v: boolean) => void;
  notify: (s: string) => void;
}) {
  const rows = demoProducts.slice().sort((a, b) => a.stock - b.stock);
  const shown = showInventory ? rows : rows.slice(0, 7);
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="OPERACIÓN · STOCK DE MUESTRA"
        title="Inventario"
        description="Existencias ficticias para probar alertas, filtros y lectura rápida."
        action={
          <button
            className="ad-outline"
            onClick={() =>
              notify("La sincronización está desactivada en este prototipo.")
            }
          >
            <Activity size={15} /> Sin sincronización
          </button>
        }
      />
      <div className="ad-inventory-alert">
        <span className="ad-alert-icon">
          <ArrowDownRight size={17} />
        </span>
        <span>
          <b>3 referencias con stock bajo en esta muestra</b>
          <small>
            Las unidades son completamente ficticias; no representan inventario
            real.
          </small>
        </span>
        <DemoTag />
      </div>
      <div className="ad-inventory-metrics">
        <div>
          <span>REFERENCIAS</span>
          <b>12</b>
          <small>productos de muestra</small>
        </div>
        <div>
          <span>UNIDADES ILUSTRATIVAS</span>
          <b>81</b>
          <small>conteo de demostración</small>
        </div>
        <div>
          <span>BAJO UMBRAL DEMO</span>
          <b>03</b>
          <small>menos de 5 unidades ficticias</small>
        </div>
        <div className="ad-inventory-action">
          <button
            className="ad-primary"
            onClick={() =>
              notify(
                "Ajustar inventario no está habilitado; ningún dato se modifica.",
              )
            }
          >
            <Pencil size={15} /> Ajustar inventario
          </button>
          <small>No se guarda en esta demo</small>
        </div>
      </div>
      <section className="ad-panel ad-inventory-table">
        <div className="ad-panel-heading">
          <div>
            <span className="ad-eyebrow">REFERENCIAS POR NIVEL DE MUESTRA</span>
            <h2>
              Stock del catálogo <DemoTag />
            </h2>
          </div>
          <button
            className="ad-text-link"
            onClick={() => setShowInventory(!showInventory)}
          >
            {showInventory ? "Ver menos" : "Ver las 12"}{" "}
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>PRODUCTO FICTICIO</th>
                <th>REFERENCIA DEMO</th>
                <th>FAMILIA</th>
                <th>UNIDADES DE MUESTRA</th>
                <th>NIVEL ILUSTRATIVO</th>
                <th>INDICADOR</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="ad-product-cell">
                      <ProductThumb product={product} size="small" />
                      <span>
                        <b>{product.name}</b>
                        <small>Producto ilustrativo</small>
                      </span>
                    </div>
                  </td>
                  <td className="ad-mono">{product.reference}</td>
                  <td>{product.category}</td>
                  <td>
                    <b>{String(product.stock).padStart(2, "0")} uds.</b>
                  </td>
                  <td>
                    <div className="ad-stock-bar">
                      <i
                        style={{
                          width: `${Math.max(2, Math.min((product.stock / 16) * 100, 100))}%`,
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <span
                      className={`ad-level ${product.stock === 0 ? "zero" : product.stock < 5 ? "low" : "healthy"}`}
                    >
                      <i />
                      {product.stock === 0
                        ? "Agotado DEMO"
                        : product.stock < 5
                          ? "Bajo DEMO"
                          : "Disponible"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Sales({
  period,
  setPeriod,
  notify,
}: {
  period: string;
  setPeriod: (v: string) => void;
  notify: (s: string) => void;
}) {
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="ANÁLISIS · MUESTRA SINTÉTICA"
        title="Ventas"
        description="Lectura de ejemplo construida para esta maqueta. No refleja ventas del negocio."
        action={
          <select
            className="ad-period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option>Últimos 30 días</option>
            <option>Últimos 7 días</option>
            <option>Este año</option>
          </select>
        }
      />
      <div className="ad-synthetic-callout">
        <WandSparkles size={16} />
        <span>
          <b>Datos generados para demostración</b> · Todas las cifras y
          visualizaciones de esta página son simuladas, no corresponden a ventas
          reales ni a datos conectados.
        </span>
      </div>
      <div className="ad-sales-summary">
        <article>
          <span>INGRESO ILUSTRATIVO</span>
          <b>$ 8,42 M</b>
          <small>DEMO · COP ficticios</small>
          <i>
            <ArrowUpRight size={14} /> 12,8% vs. periodo ficticio
          </i>
        </article>
        <article className="ad-sales-highlight">
          <span>UNIDADES DE MUESTRA</span>
          <b>128</b>
          <small>DEMO · sin transacciones reales</small>
          <i>
            <ArrowUpRight size={14} /> 8,2% vs. periodo ficticio
          </i>
        </article>
        <article>
          <span>VALOR PROMEDIO DEMO</span>
          <b>$ 65.781</b>
          <small>DEMO · valor calculado</small>
          <i>
            <ArrowUpRight size={14} /> 3,4% vs. periodo ficticio
          </i>
        </article>
      </div>
      <div className="ad-sales-chart-panel">
        <div className="ad-panel-heading">
          <div>
            <span className="ad-eyebrow">
              SERIE SINTÉTICA <DemoTag />
            </span>
            <h2>Una curva imaginada</h2>
            <p>Valores de demostración · miles de pesos colombianos</p>
          </div>
          <div className="ad-chart-unit">
            COP <small>· demo</small>
          </div>
        </div>
        <div className="ad-large-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesSeries}
              margin={{ top: 14, right: 14, left: -9, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="salesDemoGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#d6be8b" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#d6be8b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(226,216,197,.07)" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8e8994", fontSize: 11 }}
                tickMargin={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#8e8994", fontSize: 11 }}
                tickFormatter={formatCompact}
              />
              <Tooltip
                contentStyle={{
                  background: "#1c1921",
                  border: "1px solid rgba(214,190,139,.23)",
                  borderRadius: 8,
                  color: "#f3eee6",
                  fontSize: 12,
                }}
                formatter={(v) => [`$${v} mil · DEMO`, "Venta ficticia"]}
                labelFormatter={(l) => `Día ${l} · solo demostración`}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#d6be8b"
                strokeWidth={2}
                fill="url(#salesDemoGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="ad-sales-chart-foot">
          <span>
            <i /> Simulación visual
          </span>
          <span>Sin conexión a transacciones</span>
        </div>
      </div>
      <div className="ad-sales-bottom">
        <div>
          <span className="ad-eyebrow">
            FAMILIA CON MAYOR PARTICIPACIÓN DEMO
          </span>
          <b>
            Oriental <small>32% · dato ficticio</small>
          </b>
        </div>
        <div>
          <span className="ad-eyebrow">
            REFERENCIA MÁS VISTA EN ESTA MUESTRA
          </span>
          <b>
            Noche Violeta <small>DEMO · producto ficticio</small>
          </b>
        </div>
        <button
          className="ad-outline"
          onClick={() =>
            notify("No hay exportación real disponible en este prototipo.")
          }
        >
          <FileSpreadsheet size={15} /> Exportar visualización
        </button>
      </div>
    </div>
  );
}

function Reports({
  notify,
  reportNotice,
  setReportNotice,
  dbOrders,
}: {
  notify: (s: string) => void;
  reportNotice: boolean;
  setReportNotice: (b: boolean) => void;
  dbOrders: any[];
}) {
  const cards = [
    {
      icon: ChartNoAxesCombined,
      title: "Ritmo de ventas",
      subtitle: "Serie ficticia · COP ilustrativos",
      color: "lavender",
    },
    {
      icon: Boxes,
      title: "Pulso de inventario",
      subtitle: "Existencias de muestra",
      color: "gold",
    },
    {
      icon: Flower2,
      title: "Afinidad olfativa",
      subtitle: "Preferencias inventadas",
      color: "rose",
    },
    {
      icon: ShoppingBag,
      title: "Actividad de pedidos",
      subtitle: "Registros de demostración",
      color: "mint",
    },
  ];
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="ANÁLISIS · CENTRO DE INFORMES VISUALES"
        title="Reportes"
        description="Cuatro ventanas a un universo ficticio. No se crean ni descargan archivos."
        action={
          <span className="ad-visual-only">
            <Eye size={14} /> SOLO VISTA
          </span>
        }
      />
      <div className="ad-report-hero">
        <div className="ad-report-orb">
          <ChartNoAxesCombined size={25} />
        </div>
        <div>
          <span className="ad-eyebrow">COLECCIÓN DE INFORMES · DEMO</span>
          <h2>Los datos cuentan una historia inventada.</h2>
          <p>
            Estas vistas usan valores generados para evaluar el diseño. Nada
            aquí es una cifra real de negocio.
          </p>
        </div>
        <DemoTag />
      </div>
      <div className="ad-report-grid">
        {cards.map(({ icon: Icon, title, subtitle, color }, i) => (
          <article className={`ad-report-card ${color}`} key={title}>
            <div className="ad-report-card-top">
              <span className="ad-report-icon">
                <Icon size={18} />
              </span>
              <span>DEMO · {String(i + 1).padStart(2, "0")}</span>
              <MoreHorizontal size={17} />
            </div>
            <div className={`ad-report-spark spark-${i}`}>
              <svg viewBox="0 0 280 70" preserveAspectRatio="none">
                <path
                  d={
                    [
                      "M0 53 C23 49 32 23 56 34 S91 54 111 30 S146 13 167 38 S195 53 216 27 S249 32 280 8",
                      "M0 22 C28 29 36 12 68 26 S108 61 133 43 S171 15 196 35 S237 55 280 23",
                      "M0 49 C30 53 41 24 70 39 S110 53 134 21 S170 18 192 37 S229 25 280 13",
                      "M0 45 C26 46 43 17 72 30 S111 42 140 29 S181 57 204 37 S247 11 280 24",
                    ][i]
                  }
                />
              </svg>
            </div>
            <span className="ad-eyebrow">{subtitle}</span>
            <h3>{title}</h3>
            <p>
              Previsualización ilustrativa · no representa datos comerciales.
            </p>
            <button onClick={() => setReportNotice(true)}>
              Abrir visualización <ChevronRight size={14} />
            </button>
          </article>
        ))}
      </div>
      {reportNotice && (
        <div className="ad-report-notice">
          <div>
            <Eye size={17} />
            <span>
              <b>Vista previa en modo de demostración</b>
              <small>
                El informe es sintético. No se generó ningún archivo ni se
                consultaron datos.
              </small>
            </span>
          </div>
          <button
            className="ad-close-notice"
            aria-label="Cerrar aviso"
            onClick={() => setReportNotice(false)}
          >
            <X size={17} />
          </button>
        </div>
      )}
      <section className="ad-export-panel">
        <div className="ad-export-icon">
          <Download size={18} />
        </div>
        <div>
          <b>Descargas desactivadas en el prototipo</b>
          <p>
            Excel y PDF se muestran como controles visuales. Este demo no genera
            ni descarga reportes.
          </p>
        </div>
        <div className="ad-export-actions">
          <button
            className="ad-outline"
            onClick={() => {
              import("xlsx").then((XLSX) => {
                const ws = XLSX.utils.json_to_sheet(
                  dbOrders.map((o) => ({
                    Pedido: o.orderNumber,
                    Cliente: o.customerName,
                    Teléfono: o.customerPhone,
                    Ciudad: o.customerCity,
                    Estado: o.status,
                    Subtotal: o.subtotal,
                  })),
                );
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
                XLSX.writeFile(wb, "Reporte_Pedidos.xlsx");
              });
            }}
          >
            <Download size={15} /> Exportar Excel
          </button>
          <button
            className="ad-outline"
            onClick={() =>
              notify("PDF · control visual únicamente. No se generó archivo.")
            }
          >
            PDF <span>DEMO</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function UsersPage({
  active,
  setActive,
  notify,
}: {
  active: boolean;
  setActive: (b: boolean) => void;
  notify: (s: string) => void;
}) {
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="ADMINISTRACIÓN · PERMISOS SIMULADOS"
        title="Usuarios / Permisos"
        description="Una vista de roles para revisar la experiencia. El interruptor es local y no se guarda."
        action={
          <button
            className="ad-primary"
            onClick={() =>
              notify("Invitar usuario no está disponible en esta demo.")
            }
          >
            <Plus size={16} /> Invitar usuario
          </button>
        }
      />
      <div className="ad-users-note">
        <ShieldCheck size={17} />
        <span>
          <b>Sin acceso real ni autenticación.</b> Las personas y roles aquí son
          ficticios. El estado de usuarios solo existe en memoria mientras esta
          vista permanece abierta.
        </span>
        <DemoTag />
      </div>
      <div className="ad-user-layout">
        <section className="ad-panel ad-users-panel">
          <div className="ad-panel-heading">
            <div>
              <span className="ad-eyebrow">PERFILES DE DEMOSTRACIÓN</span>
              <h2>Accesos del espacio</h2>
            </div>
            <span className="ad-user-total">02 perfiles demo</span>
          </div>
          <div className="ad-user-row">
            <span className="ad-avatar ad-avatar-large">AM</span>
            <div className="ad-user-details">
              <b>Adriana M.</b>
              <small>Propietaria · identidad ficticia</small>
              <span className="ad-user-email">
                adriana@demo.local <i>· no es un correo operativo</i>
              </span>
            </div>
            <span className="ad-role-tag">PROPIETARIA DEMO</span>
            <span className="ad-user-state active">
              <i /> Activa
            </span>
            <button
              className="ad-row-action"
              aria-label="Editar perfil de Adriana"
              onClick={() => notify("Perfil de muestra · edición desactivada.")}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="ad-user-row">
            <span className="ad-avatar ad-avatar-large secondary">LC</span>
            <div className="ad-user-details">
              <b>Lucía C.</b>
              <small>Asistente de catálogo · persona ficticia</small>
              <span className="ad-user-email">
                lucia@demo.local <i>· no es un correo operativo</i>
              </span>
            </div>
            <span className="ad-role-tag">CATÁLOGO DEMO</span>
            <span className={`ad-user-state ${active ? "active" : "inactive"}`}>
              <i />
              {active ? "Activa" : "Inactiva"}
            </span>
            <button
              role="switch"
              aria-checked={active}
              className={`ad-switch ${active ? "on" : ""}`}
              onClick={() => {
                setActive(!active);
                notify(
                  `Estado local de muestra: ${active ? "inactiva" : "activa"}. No se guardó.`,
                );
              }}
              aria-label="Alternar estado local del perfil de Lucía"
            >
              <i />
            </button>
          </div>
          <div className="ad-local-warning">
            <LockKeyhole size={14} /> Activar / desactivar solo cambia la vista
            local. El cambio no se guarda ni otorga permisos reales.
          </div>
        </section>
        <aside className="ad-permission-aside">
          <div className="ad-permission-symbol">
            <ShieldCheck size={22} />
          </div>
          <span className="ad-eyebrow">MATRIZ DE DEMOSTRACIÓN</span>
          <h3>Permisos visibles</h3>
          <p>
            Los roles son muestras de interfaz, no controles de acceso reales.
          </p>
          <div className="ad-perm-line">
            <span>Catálogo</span>
            <span>Gestionar · DEMO</span>
          </div>
          <div className="ad-perm-line">
            <span>Pedidos</span>
            <span>Solo lectura · DEMO</span>
          </div>
          <div className="ad-perm-line">
            <span>Reportes</span>
            <span>Solo lectura · DEMO</span>
          </div>
          <div className="ad-perm-line">
            <span>Configuración</span>
            <span>Sin acceso · DEMO</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Settings({ notify }: { notify: (s: string) => void }) {
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="ADMINISTRACIÓN · SIN CONEXIONES ACTIVAS"
        title="Configuración comercial"
        description="Canales y destinos preparados como placeholders. No hay credenciales ni datos de contacto."
        action={
          <span className="ad-visual-only">
            <EyeOff size={14} /> NO CONECTADO
          </span>
        }
      />
      <div className="ad-setup-banner">
        <span className="ad-setup-mark">
          <Settings2 size={18} />
        </span>
        <div>
          <b>Todo permanece sin configurar.</b>
          <span>
            Este prototipo no se conecta a servicios, entidades financieras ni
            números telefónicos.
          </span>
        </div>
        <DemoTag />
      </div>
      <div className="ad-settings-grid">
        <section className="ad-panel ad-setting-card">
          <div className="ad-setting-card-top">
            <span className="ad-setting-icon">
              <Wallet size={19} />
            </span>
            <span className="ad-connection-state">
              <i /> Sin configurar
            </span>
          </div>
          <span className="ad-eyebrow">DESTINO DE PAGO</span>
          <h2>Cuenta de recaudo</h2>
          <p>
            Configura el destino de pago en una etapa futura. No se muestra ni
            solicita información bancaria.
          </p>
          <div className="ad-unset-box">
            <LockKeyhole size={15} />
            <span>
              <b>Sin cuenta vinculada</b>
              <small>Sin banco · sin número · sin credenciales</small>
            </span>
            <span className="ad-unset-pill">PLACEHOLDER</span>
          </div>
          <button
            className="ad-outline ad-config-button"
            onClick={() =>
              notify(
                "No se solicitan ni guardan datos financieros en este prototipo.",
              )
            }
          >
            Vista de configuración <ChevronRight size={14} />
          </button>
        </section>
        <section className="ad-panel ad-setting-card">
          <div className="ad-setting-card-top">
            <span className="ad-setting-icon whatsapp">
              <MessageCircle size={19} />
            </span>
            <span className="ad-connection-state">
              <i /> Sin configurar
            </span>
          </div>
          <span className="ad-eyebrow">CANAL DE ATENCIÓN</span>
          <h2>WhatsApp comercial</h2>
          <p>
            El canal está sin configurar. No se proporciona un número ficticio
            ni se abre ninguna conexión.
          </p>
          <div className="ad-unset-box">
            <MessageCircle size={15} />
            <span>
              <b>Sin número vinculado</b>
              <small>Sin contacto · sin integración · desconectado</small>
            </span>
            <span className="ad-unset-pill">PLACEHOLDER</span>
          </div>
          <button
            className="ad-outline ad-config-button"
            onClick={() =>
              notify(
                "WhatsApp permanece sin configurar: no hay conexión activa.",
              )
            }
          >
            Vista de configuración <ChevronRight size={14} />
          </button>
        </section>
      </div>
      <section className="ad-panel ad-business-details">
        <div className="ad-panel-heading">
          <div>
            <span className="ad-eyebrow">
              PERFIL DE LA TIENDA · AMBIENTACIÓN DEMO
            </span>
            <h2>Identidad de muestra</h2>
            <p>
              Contexto ficticio usado exclusivamente para vestir esta interfaz.
            </p>
          </div>
          <DemoTag />
        </div>
        <div className="ad-details-row">
          <span>Nombre visible</span>
          <b>
            Tu Perfumería <small>· provisional</small>
          </b>
        </div>
        <div className="ad-details-row">
          <span>País de referencia</span>
          <b>
            Colombia <small>· contexto ilustrativo</small>
          </b>
        </div>
        <div className="ad-details-row">
          <span>Moneda de la interfaz</span>
          <b>
            COP <small>· no son tarifas reales</small>
          </b>
        </div>
        <div className="ad-details-row">
          <span>Conexiones externas</span>
          <b className="ad-none-connected">
            <i /> Ninguna activa
          </b>
        </div>
      </section>
    </div>
  );
}

function ActivityPage() {
  const entries = [
    {
      time: "10:42",
      icon: Eye,
      title: "Vista de resumen abierta",
      detail: "Sesión de demostración · acción ilustrativa",
      kind: "NAVEGACIÓN",
    },
    {
      time: "10:18",
      icon: Package,
      title: "Catálogo de muestra consultado",
      detail: "12 productos ficticios · sin cambios",
      kind: "CATÁLOGO DEMO",
    },
    {
      time: "09:56",
      icon: Boxes,
      title: "Panel de inventario visualizado",
      detail: "Valores de stock ilustrativos · no guardados",
      kind: "INVENTARIO DEMO",
    },
    {
      time: "09:31",
      icon: ChartNoAxesCombined,
      title: "Reporte de demostración revisado",
      detail: "Contenido sintético · sin descarga",
      kind: "ANÁLISIS DEMO",
    },
    {
      time: "09:04",
      icon: ShieldCheck,
      title: "Vista de permisos explorada",
      detail: "Perfiles ficticios · sin autenticación",
      kind: "ACCESOS DEMO",
    },
  ];
  return (
    <div className="ad-page">
      <SectionHeader
        eyebrow="ADMINISTRACIÓN · REGISTRO FICTICIO"
        title="Actividad / Auditoría"
        description="Una cronología ilustrativa para mostrar cómo podría leerse la actividad."
        action={
          <button
            className="ad-outline"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Activity size={15} /> Registro demo
          </button>
        }
      />
      <div className="ad-audit-notice">
        <Activity size={17} />
        <span>
          <b>No es una auditoría real.</b> Los eventos se inventaron para la
          maqueta y no se registra actividad de usuarios.
        </span>
        <DemoTag />
      </div>
      <section className="ad-panel ad-timeline-panel">
        <div className="ad-panel-heading">
          <div>
            <span className="ad-eyebrow">
              MARTES, 18 DE JUNIO · DATOS ILUSTRATIVOS
            </span>
            <h2>Un recorrido de muestra</h2>
            <p>
              Cada evento es ficticio y no representa una acción real en el
              negocio.
            </p>
          </div>
          <span className="ad-timezone">HORA LOCAL · DEMO</span>
        </div>
        <div className="ad-timeline">
          {entries.map(({ time, icon: Icon, title, detail, kind }) => (
            <div className="ad-timeline-item" key={time}>
              <span className="ad-timeline-time">{time}</span>
              <span className="ad-timeline-node">
                <Icon size={15} />
              </span>
              <span className="ad-timeline-copy">
                <b>{title}</b>
                <small>{detail}</small>
              </span>
              <span className="ad-timeline-kind">{kind}</span>
            </div>
          ))}
        </div>
        <div className="ad-timeline-foot">
          <span>FIN DE LA MUESTRA</span>
          <span>DEMO · DATOS ILUSTRATIVOS</span>
        </div>
      </section>
      <div className="ad-note-strip">
        <LockKeyhole size={14} />
        <span>
          Sin persistencia · sin backend · sin registros de auditoría reales.
        </span>
      </div>
    </div>
  );
}

function GalleryModal({
  product,
  views,
  principalView,
  setPrincipalView,
  close,
  add,
  remove,
  move,
}: {
  product: DemoProduct;
  views: number[];
  principalView: number;
  setPrincipalView: (n: number) => void;
  close: () => void;
  add: () => void;
  remove: (index: number) => void;
  move: (index: number, direction: -1 | 1) => void;
}) {
  return (
    <div
      className="ad-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        className="ad-gallery-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-title"
      >
        <header className="ad-gallery-header">
          <div>
            <span className="ad-eyebrow">CATÁLOGO · GESTIÓN VISUAL</span>
            <h2 id="gallery-title">Galería de producto</h2>
            <p>
              {product.name} <span>·</span> {product.reference}
            </p>
          </div>
          <button
            className="ad-icon-button"
            onClick={close}
            aria-label="Cerrar galería"
          >
            <X size={18} />
          </button>
        </header>
        <div className="ad-gallery-disclaimer">
          <ImagePlus size={15} />
          <span>
            Vista previa de hasta cuatro imágenes. El orden, la imagen principal
            y los borrados solo duran esta sesión.
          </span>
          <b>NO PERSISTENTE</b>
        </div>
        <div className="ad-gallery-main">
          <div className="ad-gallery-large">
            <div className="ad-gallery-backdrop">
              <PerfumeBottle
                tone={product.tone}
                label={product.name}
                view={views[principalView] ?? 0}
              />
            </div>
            <span className="ad-gallery-large-tag">
              VISTA {String(principalView + 1).padStart(2, "0")} ·{" "}
              {principalView === 0
                ? "FRASCO"
                : principalView === 1
                  ? "DETALLE"
                  : principalView === 2
                    ? "ETIQUETA"
                    : "ESTUCHE"}
            </span>
            <span className="ad-principal-badge">
              <Check size={12} /> Principal
            </span>
          </div>
          <aside className="ad-gallery-details">
            <span className="ad-eyebrow">PRODUCTO DEMO</span>
            <h3>{product.name}</h3>
            <p>
              {product.category} · {product.size} · {product.concentration}
            </p>
            <div className="ad-gallery-views-label">
              <b>Vistas disponibles</b>
              <span>{views.length} / 4</span>
            </div>
            <div className="ad-gallery-thumbs">
              {views.map((view, i) => (
                <div
                  className={`ad-gallery-thumb ${principalView === i ? "selected" : ""}`}
                  key={`${view}-${i}`}
                >
                  <button
                    className="ad-thumb-select"
                    onClick={() => setPrincipalView(i)}
                    aria-label={`Elegir vista ${i + 1}${principalView === i ? ", principal" : ""}`}
                  >
                    <PerfumeBottle
                      tone={product.tone}
                      label={product.name}
                      view={view}
                    />
                    <span>
                      {principalView === i && <Check size={12} />}{" "}
                      {["Frasco", "Detalle", "Etiqueta", "Estuche"][view]}
                    </span>
                  </button>
                  <button
                    className="ad-thumb-delete"
                    aria-label={`Eliminar vista ${i + 1}`}
                    onClick={() => remove(i)}
                  >
                    <Trash2 size={13} />
                  </button>
                  {i > 0 && (
                    <button
                      className="ad-thumb-move"
                      aria-label={`Mover vista ${i + 1} antes`}
                      onClick={() => move(i, -1)}
                    >
                      <ChevronLeft size={12} />
                    </button>
                  )}
                  {i < views.length - 1 && (
                    <button
                      className="ad-thumb-move ad-thumb-move-next"
                      aria-label={`Mover vista ${i + 1} después`}
                      onClick={() => move(i, 1)}
                    >
                      <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              ))}
              {views.length < 4 && (
                <button className="ad-add-view" onClick={add}>
                  <ImagePlus size={16} />
                  <span>
                    Añadir vista
                    <br />
                    <small>Solo en esta sesión</small>
                  </span>
                </button>
              )}
            </div>
            <div className="ad-gallery-local-note">
              <LockKeyhole size={13} /> Ningún cambio se guarda.
            </div>
            <button className="ad-primary ad-gallery-close" onClick={close}>
              Listo <Check size={15} />
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}

const styles = `
.ad-root{--tp-ink:#0c0b10;--tp-surface:#141219;--tp-surface-raised:#1b1821;--tp-line:rgba(227,216,199,.11);--tp-paper:#eee9e1;--tp-muted:#96909c;--tp-violet:#a17ce0;--tp-violet-bright:#c1a5ed;--tp-champagne:#d7bf8d;--ad-font:"Avenir Next",Avenir,"Trebuchet MS",sans-serif;--ad-display:"Iowan Old Style",Georgia,serif;--ad-mono:"SFMono-Regular",Consolas,monospace;background:#0c0b10;color:#eee9e1;font-family:var(--ad-font);font-size:13px;line-height:1.45;min-height:100vh;position:relative;overflow-x:hidden}
.ad-root button,.ad-root select,.ad-root input{font-family:var(--ad-font)}
.ad-root button{cursor:pointer}
.ad-root button:disabled{cursor:not-allowed;opacity:.5}
.ad-root ::-webkit-scrollbar{width:8px;height:8px}.ad-root ::-webkit-scrollbar-thumb{background:#39333f;border-radius:8px}.ad-root ::-webkit-scrollbar-track{background:transparent}
.ad-shell{width:94%;max-width:1680px;min-height:100vh;margin:0 auto;display:grid;grid-template-columns:235px minmax(0,1fr);border-left:1px solid rgba(226,216,197,.06);border-right:1px solid rgba(226,216,197,.06);background:#100e14}
.ad-sidebar{position:sticky;top:0;height:100vh;min-height:700px;background:#100e14;border-right:1px solid var(--tp-line);display:flex;flex-direction:column;padding:24px 14px 14px;z-index:12}
.ad-brand{display:flex;align-items:center;gap:11px;padding:0 7px 23px}.ad-brand-icon{width:36px;height:36px;display:grid;place-items:center;color:#e0c998;border:1px solid rgba(214,190,139,.42);border-radius:12px;background:linear-gradient(145deg,rgba(166,125,220,.18),rgba(214,190,139,.04));box-shadow:inset 0 0 14px rgba(162,122,217,.1)}
.ad-brand-name{display:grid;gap:3px}.ad-brand-name b,.ad-brand-mark b{font-family:var(--ad-display);font-weight:600;font-size:16px;letter-spacing:.1px}.ad-brand-name span{font:8px var(--ad-mono);letter-spacing:1px;color:#948d9b}.ad-close-nav{display:none}
.ad-store-switch{height:55px;border:1px solid var(--tp-line);border-radius:8px;background:#15131a;display:flex;align-items:center;gap:10px;padding:8px 9px;margin:0 1px 20px}.ad-store-switch>span:nth-child(2){flex:1;display:grid;gap:2px}.ad-store-switch b{font-size:11px;font-weight:650}.ad-store-switch small{font-size:9px;color:#928b98}.ad-store-switch>svg{color:#89838e}.ad-store-glyph{width:31px;height:31px;border-radius:7px;display:grid;place-items:center;background:#292230;color:#d8c1eb;font:10px var(--ad-mono)}
.ad-nav{overflow:auto;flex:1}.ad-nav-group{margin:0 0 16px}.ad-nav-label{display:block;padding:0 10px 7px;color:#716c78;font:9px var(--ad-mono);letter-spacing:1.25px}.ad-nav-link{width:100%;height:36px;border:0;background:transparent;display:flex;align-items:center;gap:10px;padding:0 10px;margin:2px 0;border-radius:6px;text-align:left;color:#aaa4b0;font-size:11px;transition:background .18s,color .18s,transform .18s}.ad-nav-link:hover{background:rgba(255,255,255,.04);color:#f3eee6;transform:translateX(2px)}.ad-nav-link.active{background:linear-gradient(90deg,rgba(157,119,216,.2),rgba(157,119,216,.055));color:#ddc5f3;box-shadow:inset 2px 0 #b99af7}.ad-nav-link.active svg{color:#c7a7f0}.ad-nav-count{margin-left:auto;color:#d6be8b;font:9px var(--ad-mono);background:rgba(214,190,139,.1);border:1px solid rgba(214,190,139,.14);padding:2px 5px;border-radius:4px}
.ad-sidebar-bottom{padding-top:12px}.ad-stage-card{display:flex;align-items:center;gap:9px;background:#19151d;border:1px solid rgba(214,190,139,.13);border-radius:7px;padding:10px;margin-bottom:13px}.ad-stage-mark{color:#d6be8b;width:26px;height:26px;display:grid;place-items:center;background:rgba(214,190,139,.09);border-radius:6px}.ad-stage-card>span:nth-child(2){display:grid;gap:2px;flex:1}.ad-stage-card b{font-size:9px;font-weight:650}.ad-stage-card small{font-size:8px;color:#8f8994}.ad-live-dot,.ad-mode-chip>span{width:6px;height:6px;background:#7cbe94;border-radius:50%;box-shadow:0 0 8px rgba(124,190,148,.35)}.ad-profile{width:100%;display:flex;align-items:center;gap:9px;padding:9px 7px;background:none;border:0;border-top:1px solid var(--tp-line);text-align:left}.ad-avatar{width:27px;height:27px;flex:none;display:grid;place-items:center;border-radius:50%;font:9px var(--ad-mono);color:#dfc9f4;background:#362a41;border:1px solid rgba(193,165,237,.22)}.ad-profile>span:nth-child(2){display:grid;flex:1;gap:2px}.ad-profile b{font-size:10px}.ad-profile small{font-size:8px;color:#88828e}.ad-profile>svg{color:#77717d}
.ad-main{min-width:0;background:#100e14}.ad-topbar{height:64px;padding:0 30px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--tp-line);background:rgba(16,14,20,.94);position:sticky;top:0;z-index:10;backdrop-filter:blur(12px)}.ad-top-left,.ad-breadcrumb,.ad-top-actions{display:flex;align-items:center}.ad-breadcrumb{gap:9px;font-size:10px;color:#8e8793}.ad-breadcrumb b{font-weight:600;color:#ddd6e0}.ad-breadcrumb svg{color:#635d68}.ad-top-actions{gap:14px}.ad-mode-chip{display:flex;align-items:center;gap:7px;font:9px var(--ad-mono);letter-spacing:.3px;color:#c8bdd2;background:#201c26;border:1px solid rgba(193,165,237,.15);border-radius:4px;padding:6px 8px}.ad-mode-chip b{color:#d6be8b;font-size:8px;padding-left:5px;border-left:1px solid #4b4351}.ad-icon-button{width:31px;height:31px;display:grid;place-items:center;background:transparent;color:#aaa3ae;border:1px solid transparent;border-radius:6px;position:relative;transition:background .18s,color .18s}.ad-icon-button:hover,.ad-square-button:hover{color:#e9d6ff;background:#292330}.ad-notice i{position:absolute;width:5px;height:5px;right:5px;top:5px;background:#d6be8b;border-radius:50%}.ad-user-chip{display:flex;align-items:center;gap:8px;border:0;border-left:1px solid var(--tp-line);padding:0 0 0 13px;color:#d9d2de;background:none;font-size:10px}.ad-user-chip .ad-avatar{width:26px;height:26px}.ad-user-chip>svg{color:#77717d}.ad-menu-trigger{display:none;background:none;color:#dcd6e0;border:0;padding:4px}
.ad-content{padding:19px 29px 16px;max-width:1550px;margin:0 auto;min-height:calc(100vh - 64px)}.ad-demo-banner{min-height:39px;padding:8px 12px;display:flex;align-items:center;gap:9px;background:linear-gradient(90deg,rgba(150,112,205,.13),rgba(214,190,139,.045));border:1px solid rgba(172,141,213,.15);border-radius:5px;color:#b8afc0;font-size:9px;margin-bottom:23px}.ad-banner-symbol{color:#c7a4f0;display:grid;place-items:center}.ad-demo-banner b{color:#eadfff;font-weight:650}.ad-demo-banner>span:nth-child(2){flex:1}.ad-demo-banner button{display:flex;align-items:center;gap:3px;color:#d4c1eb;border:0;background:none;font-size:9px;white-space:nowrap}.ad-page{animation:ad-enter .32s ease-out both}@keyframes ad-enter{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.ad-section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:0 0 20px}.ad-eyebrow{font:9px var(--ad-mono);letter-spacing:1.1px;color:#9c93a3}.ad-section-heading h1{font-size:25px;line-height:1.2;letter-spacing:-.8px;margin:6px 0 4px;font-weight:650;color:#f0eae2}.ad-section-heading p{font-size:11px;color:#9e97a3;margin:0}.ad-heading-actions{display:flex;align-items:center;gap:8px}.ad-heading-actions select,.ad-period-select,.ad-order-tools select{height:33px;padding:0 27px 0 10px;color:#c9c2cd;background:#19171e;border:1px solid var(--tp-line);border-radius:5px;font-size:10px}.ad-primary,.ad-outline{height:34px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 12px;border-radius:5px;font-size:10px;font-weight:650;white-space:nowrap;transition:transform .17s,background .17s,border-color .17s}.ad-primary{color:#f5eff9;background:#7956a1;border:1px solid #8a65b3}.ad-primary:hover{background:#906eb7;transform:translateY(-1px)}.ad-outline{color:#c7bfcb;background:#1a171f;border:1px solid rgba(226,216,197,.15)}.ad-outline:hover{background:#24202a;border-color:rgba(214,190,139,.36)}.ad-mini-demo{font:8px var(--ad-mono);color:#e8d8b2;padding:2px 4px;background:rgba(214,190,139,.1);border-radius:3px}
.ad-demo-tag{display:inline-flex;align-items:center;color:#c6b1dd;background:rgba(163,124,224,.1);border:1px solid rgba(163,124,224,.16);border-radius:3px;padding:3px 5px;font:8px var(--ad-mono);letter-spacing:.2px;white-space:nowrap}.ad-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px;margin-bottom:13px}.ad-metric{position:relative;min-height:112px;border:1px solid rgba(226,216,197,.09);border-radius:7px;background:#17151b;padding:13px 14px 11px;overflow:hidden}.ad-metric:after{content:"";position:absolute;right:-26px;top:-37px;width:94px;height:94px;border-radius:50%;background:radial-gradient(circle,rgba(156,117,207,.095),transparent 69%);pointer-events:none}.ad-metric-top{display:flex;align-items:center;justify-content:space-between;color:#aaa3af;font-size:10px}.ad-metric-top svg{color:#b69ad2}.ad-metric strong{display:block;margin:7px 0 8px;font-size:22px;line-height:1.1;font-weight:650;letter-spacing:-.5px;color:#f2ece5}.ad-metric-bottom{display:flex;align-items:center;justify-content:space-between;gap:6px}.ad-metric-bottom>span{display:flex;align-items:center;gap:3px;color:#88bd9b;font-size:8px}.ad-metric-bottom .ad-demo-tag{font-size:7px;padding:2px 4px}.ad-gold .ad-metric-top svg{color:#d6be8b}.ad-rose .ad-metric-top svg{color:#d394a5}.ad-green .ad-metric-top svg{color:#83bb98}
.ad-dashboard-grid{display:grid;grid-template-columns:minmax(0,1.62fr) minmax(285px,.92fr);gap:12px;margin-bottom:12px}.ad-panel{background:#17151b;border:1px solid rgba(226,216,197,.09);border-radius:7px;min-width:0}.ad-sales-panel,.ad-category-panel{min-height:270px;padding:15px 16px 12px}.ad-panel-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.ad-panel-heading h2{font-size:14px;font-weight:650;letter-spacing:-.2px;margin:5px 0 3px;color:#eee8e0}.ad-panel-heading p{font-size:9px;color:#918a96;margin:0}.ad-panel-heading .ad-eyebrow{display:flex;align-items:center;gap:7px;font-size:8px}.ad-panel-heading .ad-demo-tag{font-size:7px;padding:2px 4px;letter-spacing:0}.ad-text-link{display:inline-flex;align-items:center;gap:2px;color:#c3a5e2;background:none;border:0;font-size:9px;padding:4px 0;white-space:nowrap}.ad-text-link:hover{color:#e1c9f4}.ad-chart-key{display:flex;align-items:center;justify-content:space-between;margin:11px 4px 3px;color:#96909b;font-size:8px}.ad-chart-key>span:first-child{display:flex;gap:6px;align-items:center}.ad-chart-key i,.ad-sales-chart-foot i{width:7px;height:7px;background:#b99af7;border-radius:50%}.ad-chart-period{font:8px var(--ad-mono);color:#817b87}.ad-line-chart{height:151px;width:100%}.ad-square-button{display:grid;place-items:center;width:28px;height:28px;color:#918a96;background:#211e25;border:1px solid var(--tp-line);border-radius:5px}.ad-bar-chart{height:169px;margin:4px -8px 0}.ad-panel-footlink{display:flex;align-items:center;gap:3px;color:#c1a4df;font-size:9px;background:none;border:0;padding:1px 0}.ad-lower-grid{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(225px,.72fr);gap:12px}.ad-recent-panel{padding:14px 15px 0;overflow:hidden}.ad-table-wrap{overflow:auto}.ad-table{width:100%;border-collapse:collapse;white-space:nowrap;text-align:left}.ad-table th{height:33px;color:#7d7782;border-bottom:1px solid rgba(226,216,197,.09);font:8px var(--ad-mono);letter-spacing:.5px;font-weight:400}.ad-table td{height:40px;border-bottom:1px solid rgba(226,216,197,.055);color:#c7c0ca;font-size:9px}.ad-table tr:last-child td{border-bottom:0}.ad-table td:first-child{color:#e4dce8}.ad-table .ad-mono{font:9px var(--ad-mono);color:#bca4d5}.ad-order-status{display:inline-flex;align-items:center;gap:5px;border:1px solid rgba(226,216,197,.13);border-radius:3px;padding:3px 6px;color:#b6aebb;font-size:8px}.ad-order-status i{width:5px;height:5px;border-radius:50%;background:#aaa}.ad-order-status.pending{color:#d7bd87;border-color:rgba(214,190,139,.18)}.ad-order-status.pending i{background:#d6be8b}.ad-order-status.confirmed{color:#b79cdb;border-color:rgba(163,124,224,.19)}.ad-order-status.confirmed i{background:#b99af7}.ad-order-status.paid{color:#8dc19e;border-color:rgba(133,187,151,.2)}.ad-order-status.paid i{background:#85bb97}.ad-order-status.shipped{color:#95b4ca;border-color:rgba(133,173,197,.2)}.ad-order-status.shipped i{background:#89adc8}.ad-order-status.delivered{color:#99bd9c;border-color:rgba(133,187,151,.2)}.ad-order-status.delivered i{background:#96c69f}.ad-order-status.cancelled{color:#cf9296;border-color:rgba(207,146,150,.2)}.ad-order-status.cancelled i{background:#cf9296}
.ad-stock-card{min-height:190px;position:relative;overflow:hidden;padding:15px 15px 11px;border-radius:7px;border:1px solid rgba(214,190,139,.17);background:linear-gradient(145deg,#231c24 0%,#1b171d 67%,#17151b 100%)}.ad-stock-orb{position:absolute;right:-45px;top:2px;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle,rgba(183,139,174,.16),rgba(147,100,139,.04) 50%,transparent 72%);pointer-events:none}.ad-stock-top{display:flex;justify-content:space-between;color:#d6be8b;position:relative}.ad-stock-top .ad-eyebrow{color:#bba878}.ad-stock-num{font-size:28px;font-weight:650;letter-spacing:-1px;margin:19px 0 2px;color:#f2eae0;position:relative}.ad-stock-num span{font-size:11px;font-weight:500;letter-spacing:0;color:#c8bdc5}.ad-stock-card>p{font-size:9px;color:#a39ba5;margin:0 0 18px}.ad-stock-bottom{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(226,216,197,.09);padding-top:9px;color:#8f8791;font:8px var(--ad-mono)}.ad-stock-bottom button{display:flex;align-items:center;gap:3px;background:none;border:0;color:#dfc893;font:9px var(--ad-font)}.ad-note-strip{display:flex;align-items:center;gap:8px;padding:9px 11px;background:#15131a;border:1px solid rgba(226,216,197,.07);border-radius:5px;margin-top:12px;color:#948d99;font-size:9px}.ad-note-strip>svg{color:#b99af7;flex:none}.ad-note-strip span{flex:1}.ad-note-strip button{background:none;border:0;color:#c6a7e4;font-size:9px;white-space:nowrap}.ad-footer{display:flex;justify-content:space-between;align-items:center;padding:19px 1px 3px;color:#6e6873;font:8px var(--ad-mono);letter-spacing:.35px}.ad-footer i{font-style:normal;color:#b99af7;padding:0 4px}
.ad-catalog-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:-3px 0 13px}.ad-search{height:35px;width:min(460px,56%);display:flex;align-items:center;gap:8px;padding:0 10px;color:#8c8591;border:1px solid var(--tp-line);border-radius:5px;background:#17151b}.ad-search input{min-width:0;flex:1;color:#eee8e0;background:transparent;border:0;outline:0;font-size:10px}.ad-search input::placeholder{color:#756f7a}.ad-search kbd{font:8px var(--ad-mono);color:#807a85;border:1px solid #36313b;border-radius:3px;padding:2px 4px}.ad-filter-group{display:flex;align-items:center;gap:8px;color:#8f8794}.ad-filter-group select{height:34px;background:#17151b;border:1px solid var(--tp-line);border-radius:5px;color:#c8c1cc;padding:0 25px 0 9px;font-size:9px}.ad-result-count{font:8px var(--ad-mono);color:#807985;white-space:nowrap}.ad-product-layout{display:grid;grid-template-columns:minmax(0,1fr) 255px;gap:13px;align-items:start}.ad-product-table-panel{border:1px solid rgba(226,216,197,.09);border-radius:7px;background:#17151b;min-width:0;overflow:hidden}.ad-table-caption{display:flex;align-items:center;justify-content:space-between;padding:13px 14px 9px}.ad-table-caption>div{display:grid;gap:3px}.ad-table-caption b{font-size:11px;font-weight:650}.ad-table-caption small{font-size:9px;color:#918a96}.ad-products-table th{padding:0 9px}.ad-products-table td{padding:4px 9px}.ad-products-table th:first-child,.ad-products-table td:first-child{padding-left:14px}.ad-product-cell{display:flex;align-items:center;gap:9px;min-width:145px}.ad-product-cell>span:last-child{display:grid;gap:2px}.ad-product-cell b{font-size:9px;font-weight:600;color:#e6dfe7}.ad-product-cell small{font:8px var(--ad-mono);color:#837c89}.ad-product-thumb{width:42px;height:45px;flex:none;border-radius:5px;overflow:hidden;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 63%,color-mix(in srgb,var(--tone),transparent 75%),transparent 68%),#211d26;border:1px solid rgba(255,255,255,.04)}.ad-product-thumb svg{width:39px;height:44px}.ad-product-thumb.small{width:32px;height:34px}.ad-product-thumb.small svg{width:31px;height:37px}.ad-stock-value{font:10px var(--ad-mono);color:#d3cbd6}.ad-stock-value small{font:8px var(--ad-font);color:#88818d}.ad-stock-value.low{color:#d6be8b}.ad-product-status{display:inline-flex;align-items:center;gap:5px;font-size:8px;color:#9dc6a4}.ad-product-status i{width:5px;height:5px;background:#86bd91;border-radius:50%}.ad-product-status.unavailable{color:#d19a9d}.ad-product-status.unavailable i{background:#ca898d}.ad-row-action{width:27px;height:27px;display:grid;place-items:center;color:#9e96a3;background:transparent;border:1px solid transparent;border-radius:4px}.ad-row-action:hover{color:#d5b7ee;border-color:rgba(193,165,237,.18);background:#25202b}.ad-table-end{display:flex;align-items:center;gap:6px;border-top:1px solid rgba(226,216,197,.07);padding:10px 13px;color:#79727e;font-size:8px}.ad-table-end span{color:#bd9ee1}.ad-empty{display:grid;justify-items:center;gap:7px;text-align:center;color:#a39ba7;padding:35px 10px;font-size:10px}.ad-empty svg{color:#bd9ee1}.ad-empty b{color:#e3dce5}.ad-empty button{color:#c4a4e3;background:none;border:0;font-size:9px}.ad-catalog-aside{overflow:hidden;border:1px solid rgba(214,190,139,.16);border-radius:7px;background:#1b1720}.ad-catalog-art{height:205px;position:relative;display:grid;place-items:center;overflow:hidden;background:radial-gradient(ellipse at 50% 54%,rgba(157,117,210,.2),transparent 55%),linear-gradient(145deg,#211b26,#18151a 72%)}.ad-catalog-art:before,.ad-catalog-art:after{content:"";position:absolute;width:185px;height:185px;border-radius:50%;border:1px solid rgba(214,190,139,.12);transform:rotate(-28deg) scaleX(.62)}.ad-catalog-art:after{width:145px;height:145px;border-color:rgba(193,165,237,.12);transform:rotate(37deg) scaleX(.65)}.ad-catalog-art>svg{height:180px;width:156px;z-index:1;filter:drop-shadow(0 17px 18px rgba(0,0,0,.45))}.ad-art-stamp{position:absolute;right:13px;top:14px;color:#c2a977;font:8px/1.5 var(--ad-mono);letter-spacing:1px;z-index:2}.ad-catalog-art-glow{position:absolute;width:130px;height:35px;bottom:20px;border-radius:50%;background:rgba(177,135,210,.24);filter:blur(22px)}.ad-aside-copy{padding:16px 15px 14px}.ad-aside-copy .ad-eyebrow{font-size:8px;color:#c6a6e3}.ad-aside-copy h3{font:500 21px/1.16 var(--ad-display);margin:7px 0;color:#f1e9df}.ad-aside-copy p{font-size:9px;line-height:1.65;color:#9b939f;margin:0 0 12px}.ad-aside-copy button{display:flex;align-items:center;gap:4px;color:#ddc895;font-size:9px;background:none;border:0;padding:0}.ad-aside-foot{display:flex;align-items:center;gap:10px;padding:11px 14px;border-top:1px solid rgba(226,216,197,.08);background:#19161d}.ad-aside-foot>span{font:24px var(--ad-display);color:#d7bf8d}.ad-aside-foot>div{display:grid;gap:2px}.ad-aside-foot b{font-size:9px}.ad-aside-foot small{font-size:8px;color:#89828d}
.ad-category-intro,.ad-report-hero{display:flex;align-items:center;gap:15px;padding:18px 20px;margin-bottom:14px;border:1px solid rgba(214,190,139,.15);border-radius:7px;background:radial-gradient(ellipse at 10% 80%,rgba(153,116,198,.13),transparent 42%),linear-gradient(110deg,#211b24,#1a171e)}.ad-category-orbit,.ad-report-orb{width:49px;height:49px;border:1px solid rgba(214,190,139,.27);color:#d6be8b;display:grid;place-items:center;border-radius:50%;background:rgba(214,190,139,.06);flex:none}.ad-category-intro>div:nth-child(2),.ad-report-hero>div:nth-child(2){flex:1}.ad-category-intro h2,.ad-report-hero h2{font:500 20px var(--ad-display);margin:4px 0 3px}.ad-category-intro p,.ad-report-hero p{margin:0;color:#9c94a0;font-size:9px}.ad-family-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin-bottom:14px}.ad-family-card{min-height:152px;padding:13px 14px 10px;position:relative;overflow:hidden;border:1px solid rgba(226,216,197,.1);border-radius:6px;background:linear-gradient(145deg,rgba(157,119,216,.09),transparent 75%),#17151b}.ad-family-card:nth-child(2n){background:linear-gradient(145deg,rgba(214,190,139,.075),transparent 75%),#17151b}.ad-family-count{position:absolute;right:11px;top:8px;font:20px var(--ad-display);color:rgba(214,190,139,.35)}.ad-family-icon{color:#c4a4e5;width:30px;height:30px;display:grid;place-items:center;border:1px solid rgba(193,165,237,.16);border-radius:7px;background:rgba(163,124,224,.07)}.ad-family-card h3{margin:8px 0 3px;font-size:12px;font-weight:650}.ad-family-card p{margin:0;color:#928a96;font-size:9px}.ad-family-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:13px;padding-top:8px;border-top:1px solid rgba(226,216,197,.07);color:#928a96;font-size:8px}.ad-family-bottom button{width:22px;height:22px;display:grid;place-items:center;border:0;border-radius:4px;background:#26202b;color:#c9ace8}.ad-brand-panel{padding:15px 17px}.ad-brands-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}.ad-brand-sample{display:flex;align-items:center;gap:8px;padding:10px 8px;background:#1b1820;border:1px solid rgba(226,216,197,.07);border-radius:5px}.ad-brand-monogram{width:30px;height:30px;display:grid;place-items:center;color:#d6be8b;border:1px solid rgba(214,190,139,.25);border-radius:50%;font:9px var(--ad-display)}.ad-brand-sample>span:nth-child(2){display:grid;gap:2px;min-width:0}.ad-brand-sample b{font:500 12px var(--ad-display);white-space:nowrap}.ad-brand-sample small{font:7px var(--ad-mono);color:#8d8592}.ad-brand-kind{display:none}
.ad-order-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) minmax(210px,1.3fr);gap:9px;margin:0 0 13px}.ad-order-summary>div{min-height:93px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;padding:11px 13px;border:1px solid rgba(226,216,197,.09);border-radius:6px;background:#17151b}.ad-order-summary>div>span:first-child{font:8px var(--ad-mono);letter-spacing:.6px;color:#918a96}.ad-order-summary>div>b{font-size:20px;margin:3px 0 0;font-weight:650}.ad-order-summary>div>small{font-size:8px;color:#928b96}.ad-order-summary-message{position:relative;display:grid!important;grid-template-columns:22px 1fr;align-items:center!important;gap:4px 8px!important;background:#1c1820!important;border-color:rgba(163,124,224,.12)!important;color:#a8a0ac;font-size:8px}.ad-order-summary-message svg{color:#c1a3e4}.ad-order-summary-message .ad-demo-tag{grid-column:2;justify-self:start;font-size:7px;padding:2px 4px}.ad-order-panel{padding:15px 16px 0}.ad-order-tools{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}.ad-order-tools h2{font-size:14px;margin:5px 0 0}.ad-order-tools h2 .ad-demo-tag{vertical-align:2px;font-size:7px}.ad-order-tools select{height:31px;font-size:9px}.ad-order-panel .ad-table th,.ad-order-panel .ad-table td{padding-right:13px}.ad-cell-sub{display:block;font-size:8px;color:#7f7884;margin-top:2px}
.ad-inventory-alert{display:flex;align-items:center;gap:10px;padding:11px 13px;margin-bottom:12px;border:1px solid rgba(214,190,139,.18);border-radius:6px;background:linear-gradient(90deg,rgba(214,190,139,.085),rgba(214,190,139,.025))}.ad-alert-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:5px;color:#d6be8b;background:rgba(214,190,139,.1)}.ad-inventory-alert>span:nth-child(2){display:grid;gap:2px;flex:1}.ad-inventory-alert b{font-size:10px;color:#e1d4b4}.ad-inventory-alert small{font-size:8px;color:#a49aa1}.ad-inventory-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) minmax(175px,.8fr);gap:9px;margin-bottom:13px}.ad-inventory-metrics>div{display:flex;flex-direction:column;gap:2px;padding:11px 13px;background:#17151b;border:1px solid rgba(226,216,197,.09);border-radius:6px}.ad-inventory-metrics>div>span{font:8px var(--ad-mono);color:#89828e;letter-spacing:.4px}.ad-inventory-metrics>div>b{font-size:20px;line-height:1.3}.ad-inventory-metrics>div>small{color:#8b8490;font-size:8px}.ad-inventory-metrics .ad-inventory-action{align-items:center;justify-content:center;background:#1c1820;border-color:rgba(163,124,224,.15)}.ad-inventory-action .ad-primary{height:30px}.ad-inventory-table{padding:15px 15px 0}.ad-inventory-table .ad-table td{height:46px}.ad-stock-bar{width:84px;height:4px;border-radius:3px;background:#302b33;overflow:hidden}.ad-stock-bar i{height:100%;display:block;background:#a286cb;border-radius:3px}.ad-level{display:inline-flex;align-items:center;gap:5px;font-size:8px}.ad-level i{width:5px;height:5px;border-radius:50%;background:#91bd99}.ad-level.low{color:#d6be8b}.ad-level.low i{background:#d6be8b}.ad-level.zero{color:#d3979a}.ad-level.zero i{background:#cc8b90}
.ad-synthetic-callout,.ad-users-note,.ad-audit-notice{display:flex;align-items:center;gap:9px;padding:10px 12px;margin-bottom:13px;border:1px solid rgba(214,190,139,.15);border-radius:5px;background:rgba(214,190,139,.045);color:#b4a99b;font-size:9px}.ad-synthetic-callout>svg,.ad-audit-notice>svg{color:#d6be8b;flex:none}.ad-synthetic-callout b,.ad-users-note b,.ad-audit-notice b{color:#e1d2b2}.ad-sales-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:13px}.ad-sales-summary article{position:relative;overflow:hidden;display:flex;flex-direction:column;padding:14px 15px;background:#17151b;border:1px solid rgba(226,216,197,.09);border-radius:6px}.ad-sales-summary article>span{font:8px var(--ad-mono);letter-spacing:.5px;color:#96909b}.ad-sales-summary article>b{font-size:23px;margin:7px 0 3px}.ad-sales-summary article>small{font-size:8px;color:#8e8793}.ad-sales-summary article>i{display:flex;align-items:center;gap:4px;font-style:normal;font-size:8px;color:#8fbd9b;margin-top:11px}.ad-sales-highlight{background:linear-gradient(140deg,rgba(163,124,224,.13),#17151b 77%)!important;border-color:rgba(163,124,224,.17)!important}.ad-sales-chart-panel{padding:15px 17px 10px;background:#17151b;border:1px solid rgba(226,216,197,.09);border-radius:7px}.ad-chart-unit{font:9px var(--ad-mono);color:#d6be8b}.ad-chart-unit small{color:#89828d}.ad-large-chart{height:250px;margin-top:7px}.ad-sales-chart-foot{display:flex;justify-content:space-between;padding-top:9px;border-top:1px solid rgba(226,216,197,.07);font-size:8px;color:#8d8692}.ad-sales-chart-foot span:first-child{display:flex;align-items:center;gap:6px}.ad-sales-chart-foot i{background:#d6be8b}.ad-sales-bottom{display:flex;align-items:center;gap:25px;padding:12px 3px;margin-top:11px;border-top:1px solid rgba(226,216,197,.08)}.ad-sales-bottom>div{display:grid;gap:4px}.ad-sales-bottom .ad-eyebrow{font-size:7px}.ad-sales-bottom>div>b{font-size:10px}.ad-sales-bottom>div>b small{font-weight:400;color:#928a96;font-size:8px;margin-left:5px}.ad-sales-bottom .ad-outline{margin-left:auto}
.ad-visual-only{display:inline-flex;align-items:center;gap:6px;color:#bda6d7;border:1px solid rgba(163,124,224,.17);background:rgba(163,124,224,.07);padding:7px 9px;border-radius:4px;font:8px var(--ad-mono);letter-spacing:.5px}.ad-report-hero{margin-bottom:13px;min-height:105px}.ad-report-orb{color:#c5a4e8;border-color:rgba(193,165,237,.27);background:rgba(163,124,224,.08)}.ad-report-hero h2{font-size:19px}.ad-report-hero .ad-eyebrow{color:#c7a8e4}.ad-report-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.ad-report-card{position:relative;overflow:hidden;min-height:195px;padding:13px 14px;border:1px solid rgba(226,216,197,.1);border-radius:6px;background:linear-gradient(145deg,rgba(154,118,202,.1),transparent 65%),#17151b}.ad-report-card.gold{background:linear-gradient(145deg,rgba(214,190,139,.1),transparent 65%),#17151b}.ad-report-card.rose{background:linear-gradient(145deg,rgba(192,123,166,.1),transparent 65%),#17151b}.ad-report-card.mint{background:linear-gradient(145deg,rgba(126,177,144,.09),transparent 65%),#17151b}.ad-report-card-top{display:flex;align-items:center;gap:8px}.ad-report-icon{width:31px;height:31px;border-radius:6px;display:grid;place-items:center;color:#c9afe6;background:rgba(163,124,224,.1);border:1px solid rgba(163,124,224,.14)}.ad-report-card.gold .ad-report-icon{color:#dfc994;background:rgba(214,190,139,.08);border-color:rgba(214,190,139,.13)}.ad-report-card.rose .ad-report-icon{color:#dca3bc}.ad-report-card.mint .ad-report-icon{color:#9bcea7}.ad-report-card-top>span:nth-child(2){font:8px var(--ad-mono);color:#938b98;flex:1}.ad-report-card-top>svg{color:#726c77}.ad-report-spark{height:48px;margin:6px 0 2px;opacity:.9}.ad-report-spark svg{width:100%;height:100%;overflow:visible}.ad-report-spark path{fill:none;stroke:#b99af7;stroke-width:2}.ad-report-card.gold .ad-report-spark path{stroke:#d6be8b}.ad-report-card.rose .ad-report-spark path{stroke:#ce91ae}.ad-report-card.mint .ad-report-spark path{stroke:#91bd9b}.ad-report-card>.ad-eyebrow{font-size:7px;color:#928a96}.ad-report-card h3{font-size:12px;margin:3px 0;font-weight:650}.ad-report-card p{font-size:8px;color:#8e8793;margin:0}.ad-report-card>button{display:flex;align-items:center;gap:3px;background:none;border:0;color:#c3a2e1;font-size:8px;margin-top:8px;padding:0}.ad-report-notice{display:flex;align-items:center;justify-content:space-between;padding:11px 12px;margin-top:12px;border:1px solid rgba(163,124,224,.16);border-radius:5px;background:rgba(163,124,224,.07)}.ad-report-notice>div{display:flex;align-items:center;gap:9px;color:#bca2d6}.ad-report-notice>div span{display:grid;gap:2px}.ad-report-notice b{font-size:9px;color:#ded0e9}.ad-report-notice small{font-size:8px;color:#948c99}.ad-close-notice{border:0;background:none;color:#a49ba9}.ad-export-panel{display:flex;align-items:center;gap:12px;margin-top:13px;padding:12px;background:#17151b;border:1px solid rgba(226,216,197,.09);border-radius:6px}.ad-export-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:6px;color:#d6be8b;background:rgba(214,190,139,.08)}.ad-export-panel>div:nth-child(2){flex:1}.ad-export-panel b{font-size:9px}.ad-export-panel p{font-size:8px;color:#8f8793;margin:3px 0 0}.ad-export-actions{display:flex;gap:6px}.ad-export-actions .ad-outline{height:29px;font-size:8px}.ad-export-actions .ad-outline span{font:7px var(--ad-mono);color:#d3bc8f}
.ad-users-note{margin-bottom:13px}.ad-users-note>svg{color:#c4a5e5;flex:none}.ad-users-note>span{flex:1}.ad-user-layout{display:grid;grid-template-columns:minmax(0,1fr) 265px;gap:12px}.ad-users-panel{padding:15px 16px}.ad-user-total{font:8px var(--ad-mono);color:#998fa0;border:1px solid var(--tp-line);border-radius:4px;padding:4px 6px}.ad-user-row{display:flex;align-items:center;gap:11px;padding:16px 0;border-bottom:1px solid rgba(226,216,197,.08)}.ad-user-row:first-of-type{margin-top:5px}.ad-avatar-large{width:39px;height:39px;font-size:11px}.ad-avatar.secondary{color:#e0c5d6;background:#3c2934;border-color:rgba(207,146,170,.2)}.ad-user-details{display:grid;gap:3px;flex:1}.ad-user-details>b{font-size:10px}.ad-user-details>small{font-size:8px;color:#958d99}.ad-user-email{font:8px var(--ad-mono);color:#b49bc9}.ad-user-email i{font:7px var(--ad-font);color:#746e79}.ad-role-tag{font:7px var(--ad-mono);padding:4px 5px;color:#c5a7e2;background:rgba(163,124,224,.08);border:1px solid rgba(163,124,224,.14);border-radius:3px}.ad-user-state{display:flex;align-items:center;gap:5px;font-size:8px;color:#9d969f;min-width:55px}.ad-user-state i{width:5px;height:5px;background:#777;border-radius:50%}.ad-user-state.active{color:#9cc6a5}.ad-user-state.active i{background:#88bb94}.ad-user-state.inactive{color:#cf999a}.ad-user-state.inactive i{background:#ca898d}.ad-switch{width:32px;height:18px;padding:2px;border:1px solid #57505b;border-radius:20px;background:#29252d;transition:background .18s}.ad-switch i{display:block;width:12px;height:12px;border-radius:50%;background:#8f8793;transition:transform .18s,background .18s}.ad-switch.on{background:#725492;border-color:#9270b4}.ad-switch.on i{transform:translateX(13px);background:#ead8fb}.ad-local-warning{display:flex;align-items:center;gap:7px;padding:10px 0 0;color:#948c98;font-size:8px}.ad-local-warning svg{color:#d6be8b}.ad-permission-aside{padding:15px;background:linear-gradient(150deg,rgba(163,124,224,.1),transparent 58%),#1a171e;border:1px solid rgba(163,124,224,.13);border-radius:6px}.ad-permission-symbol{width:34px;height:34px;display:grid;place-items:center;border-radius:7px;background:rgba(163,124,224,.11);color:#c3a5e1;margin-bottom:12px}.ad-permission-aside>.ad-eyebrow{font-size:8px;color:#b89dd3}.ad-permission-aside h3{font-size:13px;margin:4px 0}.ad-permission-aside>p{font-size:8px;color:#958d99;line-height:1.6;margin:0 0 13px}.ad-perm-line{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-top:1px solid rgba(226,216,197,.08);font-size:8px;color:#b8b0ba}.ad-perm-line span:last-child{color:#c0a5d9;font:7px var(--ad-mono)}
.ad-setup-banner{display:flex;align-items:center;gap:11px;padding:12px 14px;margin-bottom:13px;border:1px solid rgba(214,190,139,.16);border-radius:6px;background:linear-gradient(90deg,rgba(214,190,139,.07),rgba(214,190,139,.02))}.ad-setup-mark{width:31px;height:31px;display:grid;place-items:center;border-radius:6px;color:#d6be8b;background:rgba(214,190,139,.09)}.ad-setup-banner>div{display:grid;gap:2px;flex:1}.ad-setup-banner b{font-size:10px;color:#e0d2b3}.ad-setup-banner>div>span{font-size:8px;color:#a198a2}.ad-settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-bottom:13px}.ad-setting-card{padding:16px}.ad-setting-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.ad-setting-icon{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(214,190,139,.18);border-radius:8px;color:#d6be8b;background:rgba(214,190,139,.07)}.ad-setting-icon.whatsapp{color:#9cc9a5;border-color:rgba(145,189,155,.19);background:rgba(145,189,155,.07)}.ad-connection-state{display:flex;align-items:center;gap:6px;color:#aaa1ac;font:8px var(--ad-mono)}.ad-connection-state i{width:5px;height:5px;border-radius:50%;background:#888}.ad-setting-card>.ad-eyebrow{font-size:8px}.ad-setting-card h2{font-size:15px;margin:4px 0}.ad-setting-card>p{font-size:9px;color:#958d99;line-height:1.6;min-height:43px;margin:0 0 13px}.ad-unset-box{min-height:55px;display:flex;align-items:center;gap:9px;padding:9px;border:1px dashed rgba(226,216,197,.16);border-radius:5px;color:#938b97;background:rgba(10,9,12,.14)}.ad-unset-box>svg{flex:none;color:#9e91a8}.ad-unset-box>span:nth-child(2){display:grid;gap:3px;flex:1}.ad-unset-box b{font-size:9px;color:#c8c0ca;font-weight:600}.ad-unset-box small{font-size:7px;color:#837c87}.ad-unset-pill{font:7px var(--ad-mono);color:#a298a5;border:1px solid rgba(226,216,197,.12);border-radius:3px;padding:4px}.ad-config-button{margin-top:12px;height:30px;font-size:8px}.ad-business-details{padding:15px 17px}.ad-details-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-top:1px solid rgba(226,216,197,.07);font-size:9px;color:#9b939f}.ad-details-row>b{font-size:9px;font-weight:550;color:#ded7df}.ad-details-row>b small{font-size:8px;color:#8d8691;font-weight:400}.ad-none-connected{display:flex;align-items:center;gap:6px}.ad-none-connected i{width:5px;height:5px;border-radius:50%;background:#87818a}
.ad-audit-notice>span{flex:1}.ad-timeline-panel{padding:16px 17px 0}.ad-timezone{color:#89818d;font:8px var(--ad-mono)}.ad-timeline{padding:12px 0 3px}.ad-timeline-item{min-height:61px;display:grid;grid-template-columns:58px 32px minmax(0,1fr) auto;align-items:center;gap:10px;position:relative}.ad-timeline-item:not(:last-child):before{content:"";position:absolute;left:83px;top:41px;height:27px;border-left:1px solid rgba(193,165,237,.18)}.ad-timeline-time{justify-self:end;color:#8b8490;font:9px var(--ad-mono)}.ad-timeline-node{width:28px;height:28px;display:grid;place-items:center;border:1px solid rgba(193,165,237,.18);border-radius:50%;color:#b99af7;background:#211c27;z-index:1}.ad-timeline-item:nth-child(even) .ad-timeline-node{color:#d6be8b;border-color:rgba(214,190,139,.2);background:#24201d}.ad-timeline-copy{display:grid;gap:3px}.ad-timeline-copy b{font-size:9px;font-weight:600;color:#dcd5de}.ad-timeline-copy small{font-size:8px;color:#8f8794}.ad-timeline-kind{font:7px var(--ad-mono);color:#a991c2;border:1px solid rgba(163,124,224,.12);padding:3px 5px;border-radius:3px}.ad-timeline-foot{display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(226,216,197,.07);color:#746d79;font:7px var(--ad-mono);letter-spacing:.4px}
.ad-modal-backdrop{position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:20px;background:rgba(5,4,7,.78);backdrop-filter:blur(8px);animation:ad-fade .18s ease-out}@keyframes ad-fade{from{opacity:0}to{opacity:1}}.ad-gallery-modal{width:min(810px,96vw);max-height:90vh;overflow:auto;border:1px solid rgba(214,190,139,.2);border-radius:9px;background:#17141b;box-shadow:0 22px 90px rgba(0,0,0,.56)}.ad-gallery-header{display:flex;justify-content:space-between;align-items:flex-start;padding:18px 20px 12px}.ad-gallery-header h2{margin:4px 0 2px;font-size:17px}.ad-gallery-header p{margin:0;color:#9b939f;font-size:9px}.ad-gallery-header p span{color:#c4a4e5;padding:0 4px}.ad-gallery-disclaimer{display:flex;align-items:center;gap:8px;margin:0 20px 15px;padding:9px 10px;color:#b2a6b5;background:rgba(163,124,224,.07);border:1px solid rgba(163,124,224,.12);border-radius:4px;font-size:8px}.ad-gallery-disclaimer svg{color:#c6a8e5;flex:none}.ad-gallery-disclaimer span{flex:1}.ad-gallery-disclaimer b{font:7px var(--ad-mono);color:#d8c295}.ad-gallery-main{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(260px,.9fr);gap:17px;padding:0 20px 19px}.ad-gallery-large{min-height:355px;position:relative;display:grid;place-items:center;overflow:hidden;border:1px solid rgba(226,216,197,.08);border-radius:6px;background:radial-gradient(ellipse at 50% 55%,rgba(163,124,224,.18),transparent 56%),linear-gradient(145deg,#211c25,#17141a)}.ad-gallery-large:before,.ad-gallery-large:after{content:"";position:absolute;width:275px;height:275px;border:1px solid rgba(214,190,139,.12);border-radius:50%;transform:scaleX(.58) rotate(35deg)}.ad-gallery-large:after{width:225px;height:225px;border-color:rgba(193,165,237,.13);transform:scaleX(.72) rotate(-28deg)}.ad-gallery-backdrop{width:210px;height:245px;display:grid;place-items:center;z-index:1}.ad-gallery-backdrop svg{height:245px;width:215px;filter:drop-shadow(0 15px 20px rgba(0,0,0,.48))}.ad-gallery-large-tag{position:absolute;left:12px;bottom:11px;color:#a39aa7;font:8px var(--ad-mono);letter-spacing:.6px}.ad-principal-badge{position:absolute;right:10px;top:10px;display:flex;align-items:center;gap:4px;padding:4px 6px;color:#ead8b3;border:1px solid rgba(214,190,139,.2);border-radius:3px;background:rgba(214,190,139,.08);font-size:8px}.ad-gallery-details{display:flex;flex-direction:column;min-width:0}.ad-gallery-details>.ad-eyebrow{font-size:8px;color:#bd9fda}.ad-gallery-details h3{font:500 20px var(--ad-display);margin:5px 0}.ad-gallery-details>p{margin:0;color:#99919d;font-size:9px}.ad-gallery-views-label{display:flex;align-items:center;justify-content:space-between;margin:20px 0 9px}.ad-gallery-views-label b{font-size:9px}.ad-gallery-views-label span{font:8px var(--ad-mono);color:#9c8ca7}.ad-gallery-thumbs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.ad-gallery-thumb{height:126px;position:relative;overflow:hidden;border:1px solid rgba(226,216,197,.1);border-radius:5px;background:#201c24}.ad-gallery-thumb.selected{border-color:rgba(214,190,139,.43);box-shadow:inset 0 0 0 1px rgba(214,190,139,.09)}.ad-thumb-select{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#aaa1ae;background:transparent;border:0;font-size:8px}.ad-thumb-select svg{width:77px;height:83px}.ad-thumb-select>span{display:flex;align-items:center;gap:3px}.ad-thumb-select>span svg{width:11px;height:11px;color:#d6be8b}.ad-thumb-delete,.ad-thumb-move{width:21px;height:21px;display:grid;place-items:center;position:absolute;right:4px;top:4px;background:#151219c9;color:#b6aab9;border:1px solid rgba(226,216,197,.09);border-radius:4px}.ad-thumb-delete:hover{color:#dc999c}.ad-thumb-move{right:auto;left:4px}.ad-add-view{min-height:126px;display:flex;align-items:center;justify-content:center;gap:7px;color:#c1a5df;border:1px dashed rgba(193,165,237,.25);border-radius:5px;background:rgba(163,124,224,.035);font-size:8px;text-align:left}.ad-add-view>span{display:grid;gap:3px}.ad-add-view small{color:#817987;font-size:7px}.ad-gallery-local-note{display:flex;align-items:center;gap:6px;color:#918994;font-size:8px;margin-top:auto;padding:12px 0 8px}.ad-gallery-local-note svg{color:#d6be8b}.ad-gallery-close{width:100%;height:32px}.ad-toast{position:fixed;right:22px;bottom:20px;z-index:50;display:flex;align-items:center;gap:8px;padding:11px 14px;border:1px solid rgba(214,190,139,.2);border-radius:6px;background:#24202a;color:#e7d9bc;font-size:10px;box-shadow:0 9px 28px rgba(0,0,0,.4);animation:ad-enter .2s ease-out}.ad-toast svg{color:#95c19a}
.ad-login-screen{min-height:100vh;display:grid;grid-template-columns:1.08fr .92fr;background:#0c0b10}.ad-login-art{position:relative;min-height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 52%,rgba(144,101,192,.23),transparent 38%),linear-gradient(145deg,#17121d,#110f15 70%)}.ad-login-art:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 49.9%,rgba(214,190,139,.07) 50%,transparent 50.1%),linear-gradient(0deg,transparent 49.9%,rgba(214,190,139,.055) 50%,transparent 50.1%);background-size:80px 80px;opacity:.25;mask-image:radial-gradient(ellipse at center,black,transparent 73%)}.ad-login-orbit{position:absolute;border:1px solid rgba(214,190,139,.14);width:min(67vh,520px);height:min(67vh,520px);border-radius:50%;transform:scaleX(.62) rotate(32deg)}.ad-login-orbit.orbit-two{width:min(52vh,410px);height:min(52vh,410px);border-color:rgba(193,165,237,.14);transform:scaleX(.72) rotate(-29deg)}.ad-login-perfume{z-index:1;filter:drop-shadow(0 25px 30px rgba(0,0,0,.45));transform:translateY(-48px)}.ad-login-perfume svg{width:min(300px,35vw);height:auto}.ad-login-caption{position:absolute;left:8%;bottom:8%;display:grid;gap:8px}.ad-login-caption>span{color:#b7a77b;font:8px var(--ad-mono);letter-spacing:1.6px}.ad-login-caption b{font:500 clamp(24px,3vw,40px)/1.08 var(--ad-display);color:#eee5d8}.ad-login-caption small{color:#a098a5;font-size:9px}.ad-login-panel{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:50px clamp(32px,7vw,105px);background:#100e14;border-left:1px solid rgba(214,190,139,.12)}.ad-login-back{position:absolute;top:28px;left:35px;display:flex;align-items:center;gap:4px;background:none;border:0;color:#a39aa8;font-size:10px}.ad-brand-mark{display:flex;align-items:center;gap:11px}.ad-brand-mark .ad-brand-icon{width:40px;height:40px}.ad-brand-mark>div{display:grid;gap:2px}.ad-brand-mark small{font:8px var(--ad-mono);letter-spacing:1.2px;color:#8f8794}.ad-login-copy{margin-top:60px}.ad-login-copy .ad-eyebrow{color:#bda2d8}.ad-login-copy h1{font-size:clamp(30px,3.2vw,42px);line-height:1.12;letter-spacing:-1.2px;margin:12px 0 12px}.ad-login-copy h1 i{font:500 1em var(--ad-display);color:#d6be8b}.ad-login-copy p{max-width:360px;color:#a199a5;font-size:11px;line-height:1.7}.ad-login-enter{height:41px;width:100%;justify-content:space-between;margin-top:20px;padding:0 14px}.ad-login-safety{display:flex;align-items:center;gap:7px;margin-top:15px;color:#918a96;font-size:8px}.ad-login-safety svg{color:#8ebe9b}.ad-login-foot{position:absolute;bottom:23px;left:35px;color:#6e6874;font:8px var(--ad-mono);letter-spacing:.6px}.ad-login-foot span{color:#b99af7}
.ad-mobile-scrim{display:none}
@media(max-width:1250px){.ad-shell{grid-template-columns:216px minmax(0,1fr);width:96%}.ad-sidebar{padding-left:11px;padding-right:11px}.ad-content{padding-left:22px;padding-right:22px}.ad-topbar{padding:0 22px}.ad-user-layout{grid-template-columns:minmax(0,1fr) 235px}.ad-brand-kind{display:none}.ad-product-layout{grid-template-columns:minmax(0,1fr) 225px}}
@media(max-width:1000px){.ad-shell{grid-template-columns:200px minmax(0,1fr);width:100%}.ad-metric{padding:11px}.ad-metric strong{font-size:20px}.ad-metric-bottom .ad-demo-tag{display:none}.ad-dashboard-grid{grid-template-columns:minmax(0,1.35fr) minmax(250px,.85fr)}.ad-product-layout{grid-template-columns:minmax(0,1fr)}.ad-catalog-aside{display:grid;grid-template-columns:190px 1fr}.ad-catalog-art{height:190px;grid-row:span 2}.ad-aside-foot{align-self:end}.ad-family-grid{grid-template-columns:repeat(2,1fr)}.ad-order-summary{grid-template-columns:repeat(3,1fr)}.ad-order-summary-message{grid-column:1/-1;min-height:64px!important}.ad-user-layout{grid-template-columns:1fr}.ad-permission-aside{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:0 10px}.ad-permission-symbol{grid-row:span 2;margin:0}.ad-permission-aside>.ad-eyebrow{grid-column:2}.ad-permission-aside h3{grid-column:2;margin:3px 0}.ad-permission-aside>p{grid-column:3;grid-row:1/3;margin:0;max-width:210px}.ad-perm-line{grid-column:span 3}}
@media(max-width:760px){.ad-shell{display:block;width:100%;border:0}.ad-sidebar{position:fixed;left:0;top:0;bottom:0;width:276px;height:100dvh;min-height:0;transform:translateX(-104%);transition:transform .24s ease;box-shadow:14px 0 55px rgba(0,0,0,.42)}.ad-sidebar.is-open{transform:translateX(0)}.ad-mobile-scrim{display:block;position:fixed;inset:0;z-index:11;background:rgba(0,0,0,.6);border:0}.ad-close-nav{display:grid;place-items:center;margin-left:auto;background:none;border:0;color:#b9b1bd}.ad-topbar{height:56px;padding:0 14px}.ad-menu-trigger{display:grid;place-items:center}.ad-top-left{gap:9px}.ad-breadcrumb{font-size:9px;gap:5px}.ad-top-actions{gap:5px}.ad-top-actions>.ad-icon-button:first-of-type{display:none}.ad-mode-chip{font-size:0;gap:0;padding:7px}.ad-mode-chip b{font-size:7px;border:0;padding-left:5px}.ad-user-chip{border:0;padding-left:5px}.ad-user-chip>span:nth-child(2),.ad-user-chip>svg{display:none}.ad-content{padding:13px 12px 12px;min-height:calc(100dvh - 56px)}.ad-demo-banner{align-items:flex-start;line-height:1.55;margin-bottom:18px;padding:8px}.ad-demo-banner button span{display:none}.ad-section-heading{align-items:flex-start;margin-bottom:15px}.ad-section-heading h1{font-size:22px}.ad-section-heading p{max-width:520px;font-size:10px}.ad-heading-actions{flex-wrap:wrap;justify-content:flex-end}.ad-heading-actions select{display:none}.ad-heading-actions>.ad-outline{font-size:0;width:34px;padding:0}.ad-heading-actions>.ad-outline svg{flex:none}.ad-primary{font-size:9px;padding:0 9px}.ad-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ad-metric{min-height:100px}.ad-metric strong{font-size:21px}.ad-metric-bottom .ad-demo-tag{display:inline-flex}.ad-dashboard-grid{grid-template-columns:1fr;gap:9px}.ad-sales-panel,.ad-category-panel{min-height:unset;padding:13px}.ad-line-chart{height:160px}.ad-bar-chart{height:160px}.ad-lower-grid{grid-template-columns:1fr;gap:9px}.ad-recent-panel{padding:12px 11px 0}.ad-stock-card{min-height:165px}.ad-note-strip{align-items:flex-start;font-size:8px}.ad-footer{font-size:7px}.ad-catalog-toolbar{align-items:stretch;flex-direction:column}.ad-search{width:100%}.ad-filter-group{justify-content:space-between}.ad-filter-group select{flex:1}.ad-product-layout{grid-template-columns:1fr}.ad-product-table-panel{margin-right:0}.ad-products-table{min-width:700px}.ad-catalog-aside{grid-template-columns:125px 1fr}.ad-catalog-art{height:170px;grid-row:span 2}.ad-catalog-art>svg{height:145px}.ad-aside-copy{padding:12px}.ad-aside-copy h3{font-size:18px}.ad-aside-copy p{font-size:8px}.ad-aside-copy button{font-size:8px}.ad-aside-foot{padding:8px 11px}.ad-aside-foot>span{font-size:20px}.ad-family-grid{gap:8px}.ad-family-card{min-height:143px;padding:11px}.ad-brands-row{grid-template-columns:repeat(2,1fr)}.ad-order-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.ad-order-summary-message{grid-column:1/-1}.ad-order-panel{padding:12px 11px 0}.ad-order-panel .ad-table{min-width:760px}.ad-inventory-metrics{grid-template-columns:repeat(2,1fr)}.ad-inventory-table{padding:12px 11px 0}.ad-inventory-table .ad-table{min-width:760px}.ad-sales-summary{gap:7px}.ad-sales-summary article{padding:11px}.ad-sales-summary article>b{font-size:19px}.ad-sales-summary article>span{font-size:7px}.ad-sales-summary article>i{font-size:7px}.ad-large-chart{height:210px}.ad-sales-bottom{flex-wrap:wrap;gap:12px}.ad-sales-bottom .ad-outline{margin-left:0}.ad-report-grid{gap:8px}.ad-report-card{min-height:185px;padding:11px}.ad-report-hero{padding:13px;gap:10px}.ad-report-hero h2{font-size:17px}.ad-report-hero p{font-size:8px}.ad-report-hero>.ad-demo-tag{display:none}.ad-export-panel{flex-wrap:wrap}.ad-export-actions{width:100%;margin-left:44px}.ad-user-row{gap:7px;flex-wrap:wrap}.ad-user-details{min-width:calc(100% - 60px)}.ad-role-tag{margin-left:45px}.ad-user-state{margin-left:auto}.ad-local-warning{line-height:1.5}.ad-permission-aside{display:block}.ad-permission-symbol{margin-bottom:10px}.ad-permission-aside>p{max-width:none;margin-bottom:10px}.ad-perm-line{display:flex}.ad-settings-grid{grid-template-columns:1fr}.ad-setting-card>p{min-height:0}.ad-gallery-modal{width:min(540px,96vw)}.ad-gallery-main{grid-template-columns:1fr;padding:0 14px 14px;gap:12px}.ad-gallery-header{padding:15px 14px 10px}.ad-gallery-disclaimer{margin:0 14px 12px}.ad-gallery-large{min-height:250px}.ad-gallery-backdrop{height:215px}.ad-gallery-backdrop svg{height:210px}.ad-gallery-thumbs{grid-template-columns:repeat(4,minmax(0,1fr))}.ad-gallery-thumb,.ad-add-view{height:104px;min-height:104px}.ad-thumb-select svg{width:54px;height:70px}.ad-thumb-move{display:none}.ad-login-screen{grid-template-columns:1fr;min-height:100dvh}.ad-login-art{min-height:35dvh}.ad-login-perfume{transform:translateY(12px)}.ad-login-perfume svg{width:120px}.ad-login-orbit{width:240px;height:240px}.ad-login-orbit.orbit-two{width:190px;height:190px}.ad-login-caption{left:6%;bottom:10%}.ad-login-caption>span{font-size:7px}.ad-login-caption b{font-size:24px}.ad-login-caption small{font-size:8px}.ad-login-panel{min-height:65dvh;padding:38px 8% 54px;border-left:0;border-top:1px solid rgba(214,190,139,.12);justify-content:flex-start}.ad-login-back{top:13px;left:14px;font-size:9px}.ad-brand-mark{margin-top:12px}.ad-brand-mark .ad-brand-icon{width:34px;height:34px}.ad-login-copy{margin-top:26px}.ad-login-copy h1{font-size:29px}.ad-login-copy p{font-size:10px}.ad-login-foot{left:8%;bottom:17px}}
@media(max-width:430px){.ad-topbar{padding:0 10px}.ad-content{padding-left:9px;padding-right:9px}.ad-breadcrumb{max-width:155px;overflow:hidden;white-space:nowrap}.ad-breadcrumb b{overflow:hidden;text-overflow:ellipsis}.ad-mode-chip{padding:6px}.ad-section-heading h1{font-size:20px}.ad-section-heading p{font-size:9px}.ad-metrics{gap:6px}.ad-metric{padding:10px 9px}.ad-metric-top{font-size:9px}.ad-metric strong{font-size:19px}.ad-metric-bottom>span{font-size:7px}.ad-metric-bottom .ad-demo-tag{font-size:6px}.ad-family-grid{grid-template-columns:1fr 1fr}.ad-family-card p{font-size:8px}.ad-family-bottom{font-size:7px}.ad-category-intro{padding:12px}.ad-category-orbit{width:38px;height:38px}.ad-category-intro h2{font-size:16px}.ad-category-intro p{font-size:8px}.ad-category-intro>.ad-demo-tag{display:none}.ad-report-grid{grid-template-columns:1fr}.ad-report-card{min-height:166px}.ad-report-spark{height:38px}.ad-sales-summary article{padding:9px 8px}.ad-sales-summary article>b{font-size:17px}.ad-sales-summary article>small{font-size:7px}.ad-sales-bottom>div{width:100%}.ad-sales-bottom .ad-outline{width:100%}.ad-order-summary{gap:6px}.ad-order-summary>div{padding:9px}.ad-order-summary>div>b{font-size:17px}.ad-order-summary-message{min-height:76px!important}.ad-inventory-metrics{gap:6px}.ad-inventory-metrics>div{padding:9px}.ad-inventory-metrics>div>b{font-size:18px}.ad-catalog-aside{grid-template-columns:105px 1fr}.ad-catalog-art{height:160px}.ad-aside-copy h3{font-size:16px}.ad-aside-copy p{line-height:1.4}.ad-aside-foot small{font-size:7px}.ad-user-email i{display:block}.ad-user-row{padding:12px 0}.ad-user-row .ad-role-tag{margin-left:45px}.ad-user-row .ad-user-state{margin-left:auto}.ad-user-row .ad-switch{margin-right:4px}.ad-setup-banner .ad-demo-tag,.ad-users-note .ad-demo-tag,.ad-audit-notice .ad-demo-tag{display:none}.ad-unset-box{gap:6px}.ad-unset-pill{font-size:6px}.ad-gallery-thumbs{grid-template-columns:repeat(2,minmax(0,1fr))}.ad-gallery-thumb,.ad-add-view{height:100px;min-height:100px}.ad-gallery-disclaimer b{display:none}.ad-footer{font-size:6px}}
@media(prefers-reduced-motion:reduce){.ad-root *, .ad-root *:before,.ad-root *:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
.ad-products-table{min-width:760px}
.ad-product-actions{display:flex;align-items:center;gap:2px}
.ad-audience-pill{display:inline-flex;padding:3px 7px;border:1px solid rgba(193,165,237,.18);border-radius:12px;background:rgba(163,124,224,.07);color:#d3c2e7;font-size:8px}
.ad-editor-backdrop{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:20px;background:rgba(4,3,7,.78);backdrop-filter:blur(5px)}
.ad-editor-card{width:min(680px,100%);max-height:min(92vh,820px);overflow:auto;padding:22px;border:1px solid rgba(214,190,139,.24);border-radius:10px;background:linear-gradient(145deg,#1b1720,#121015 70%);box-shadow:0 25px 80px rgba(0,0,0,.6)}
.ad-editor-heading{display:flex;align-items:flex-start;gap:11px;margin-bottom:19px}
.ad-editor-heading>div{flex:1}
.ad-editor-heading h2{margin:5px 0 0;color:#f1e9df;font:500 25px/1.1 var(--ad-display)}
.ad-editor-heading>.ad-row-action{flex:none}
.ad-editor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
.ad-editor-grid label{display:grid;gap:6px;color:#b6adba;font-size:9px}
.ad-editor-grid input,.ad-editor-grid select{width:100%;height:37px;padding:0 10px;border:1px solid rgba(226,216,197,.14);border-radius:5px;background:#17141b;color:#eee8e0;font-size:10px}
.ad-editor-grid input::placeholder{color:#7c7480}
.ad-editor-disclaimer{display:flex;align-items:center;gap:7px;margin:16px 0;color:#9f97a3;font-size:9px}
.ad-editor-disclaimer svg{flex:none;color:#d6be8b}
.ad-editor-actions{display:flex;justify-content:flex-end;gap:8px;padding-top:13px;border-top:1px solid rgba(226,216,197,.09)}
@media(max-width:760px){.ad-editor-card{padding:17px 14px}.ad-editor-heading h2{font-size:21px}.ad-editor-grid{grid-template-columns:1fr;gap:10px}.ad-editor-grid input,.ad-editor-grid select{height:35px}.ad-editor-actions{flex-direction:column-reverse}.ad-editor-actions button{width:100%}.ad-products-table{min-width:770px}}
/* =========================================
   AJUSTE GLOBAL DE LEGIBILIDAD (ADMIN)
   ========================================= */
.ad-root p, 
.ad-root span, 
.ad-root small, 
.ad-root button, 
.ad-root input, 
.ad-root select, 
.ad-root label,
.ad-root table, 
.ad-root th, 
.ad-root td,
.ad-root li,
.ad-root div,
.ad-badge,
.ad-label,
.ad-value,
.ad-table th,
.ad-table td {
  font-size: 13px !important;
}

/* Párrafos y descripciones un poco más grandes */
.ad-root p {
  font-size: 13px !important;
  line-height: 1.6 !important;
}

/* Títulos no se tocan para mantener la jerarquía */
.ad-root h1, 
.ad-root h2, 
.ad-root h3,
.ad-metric-value,
.ad-title {
  font-size: revert !important;
}

/* Ajuste de tablas para que respiren con el nuevo tamaño */
.ad-root td, .ad-root th {
  padding: 12px 10px !important;
}
`;
