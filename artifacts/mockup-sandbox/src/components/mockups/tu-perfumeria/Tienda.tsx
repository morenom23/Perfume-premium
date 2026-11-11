import { useEffect, useRef, useState } from "react";
import {
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Facebook,
  Flower2,
  Heart,
  Headphones,
  Instagram,
  Mail,
  MessageCircle,
  Menu,
  Minus,
  Music2,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  UserRound,
  Youtube,
  X,
} from "lucide-react";
import { demoAudiences, demoBrands, demoCategories, demoGalleryViews, demoProducts, formatCop, type DemoProduct } from "./_shared/demoProducts";
import { PerfumeBottle } from "./_shared/PerfumeBottle";
import "./_shared/theme.css";
import { Admin } from "./Admin";

type Page = "Inicio" | "Catálogo" | "Detalle" | "Marca" | "Envíos y pagos" | "Contacto" | "Carrito" | "Checkout" | "Administración";
type SortMode = "featured" | "price-low" | "price-high" | "name";

const publicPages: { label: string; page: Page }[] = [
  { label: "Inicio", page: "Inicio" },
  { label: "Catálogo", page: "Catálogo" },
  { label: "Nosotros", page: "Marca" },
  { label: "Envíos", page: "Envíos y pagos" },
  { label: "Contacto", page: "Contacto" },
];
const deliveryCopy = "Tus productos llegarán aproximadamente entre 3 y 4 días hábiles después de haber confirmado el pedido. El costo del envío se calcula según tu ubicación";

function DemoFlag({ children = "DEMO" }: { children?: string }) {
  return <span className="tp-demo-flag">{children}</span>;
}

function Gallery({
  product,
  view,
  setView,
  compact = false,
}: {
  product: DemoProduct;
  view: number;
  setView: (view: number) => void;
  compact?: boolean;
}) {
  const touchStart = useRef<number | null>(null);
  const cycle = (step: number) => setView((view + step + demoGalleryViews.length) % demoGalleryViews.length);
  return (
    <div
      className={`tp-gallery ${compact ? "tp-gallery-compact" : ""}`}
      role="group"
      aria-label={`Galería de ${product.name}, vista ${demoGalleryViews[view]}`}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); cycle(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); cycle(-1); }
      }}
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
        if (Math.abs(delta) > 32) cycle(delta < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="tp-gallery-main">
        <div className="tp-gallery-glow" style={{ background: `radial-gradient(ellipse at 50% 59%, ${product.tone}45, transparent 68%)` }} />
        <div className="tp-gallery-number">{String(view + 1).padStart(2, "0")} <span>/ 04</span></div>
        <PerfumeBottle tone={product.tone} view={view} label={product.name} className="tp-bottle-art" />
        {view === 1 && <div className="tp-art-caption">VIDRIO · REFLEJO</div>}
        {view === 2 && <div className="tp-art-caption">ETIQUETA · DETALLE</div>}
        {view === 3 && <div className="tp-art-caption">ESTUCHE · EDICIÓN DEMO</div>}
      </div>
      <div className="tp-gallery-thumbs" aria-label="Vistas del producto">
        {demoGalleryViews.map((label, index) => index !== view && (
          <button
            key={label}
            type="button"
            className="tp-gallery-thumb"
            aria-label={`Ver ${label}`}
            aria-pressed={false}
            onClick={(event) => { event.stopPropagation(); setView(index); }}
          ><PerfumeBottle tone={product.tone} view={index} label={`${product.name}: ${label}`} className="tp-thumb-bottle" /></button>
        ))}
      </div>
      {!compact && (
        <>
          <button type="button" className="tp-gallery-arrow tp-gallery-prev" onClick={() => cycle(-1)} aria-label="Vista anterior"><ChevronLeft size={17} /></button>
          <button type="button" className="tp-gallery-arrow tp-gallery-next" onClick={() => cycle(1)} aria-label="Vista siguiente"><ChevronRight size={17} /></button>
        </>
      )}
    </div>
  );
}

function ProductCard({
  product,
  view,
  setView,
  favorite,
  onFavorite,
  onOpen,
  onAdd,
  added,
}: {
  product: DemoProduct;
  view: number;
  setView: (view: number) => void;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
  onAdd: () => void;
  added: boolean;
}) {
  return (
    <article className="tp-product-card">
      <div className="tp-card-visual">
        <Gallery product={product} view={view} setView={setView} compact />
        <button type="button" className={`tp-heart ${favorite ? "is-favorite" : ""}`} onClick={onFavorite} aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"} aria-pressed={favorite}>
          <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="tp-product-copy">
        <button type="button" className="tp-product-name" onClick={onOpen}>{product.name}</button>
        <div className="tp-product-meta"><span>Ref. {product.reference}</span><span>{product.audience} · {product.category}</span></div>
        <div className="tp-product-bottom">
          <div><strong>{formatCop(product.price)}</strong><small>PRECIO DEMO</small></div>
          <button type="button" className={`tp-product-cta ${added ? "is-added" : ""}`} disabled={product.stock === 0} onClick={onAdd}>
            {product.stock === 0 ? <X size={14} /> : added ? <Check size={14} /> : <ShoppingCart size={14} />}
            <span>{product.stock === 0 ? "Agotado" : added ? "Agregado" : "Agregar"}</span>
            <i><ChevronRight size={13} /></i>
          </button>
        </div>
        <div className={`tp-stock ${product.stock === 0 ? "is-out" : ""}`}>{product.status} · DEMO</div>
      </div>
    </article>
  );
}

export function Tienda() {
  const [page, setPage] = useState<Page>("Inicio");
  const [checkoutData, setCheckoutData] = useState({ name: "", phone: "", city: "", address: "" });
  /*const [selected, setSelected] = useState<DemoProduct>(productsData[0]);*/
  const [selected, setSelected] = useState<DemoProduct | null>(null);
  const [productsData, setProductsData] = useState<DemoProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("Todas las familias");
  const [audience, setAudience] = useState<(typeof demoAudiences)[number]>("Todos");
  const [brand, setBrand] = useState("Todas las marcas");
  const [priceRange, setPriceRange] = useState("Todos los precios");
  const [availability, setAvailability] = useState("Todas");
  const [sort, setSort] = useState<SortMode>("featured");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cardViews, setCardViews] = useState<Record<string, number>>({});
  const [detailView, setDetailView] = useState(0);
  const [toast, setToast] = useState("");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [checkoutChecked, setCheckoutChecked] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

    useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p: any) => ({
          ...p,
          id: String(p.id),
          tone: "#9a68ef", 
          notes: ["Nota 1", "Nota 2"], 
          status: p.status === "published" ? "Disponible" : "Agotado",
          featured: p.isFeatured,
        }));
        setProductsData(formatted);
        if (formatted.length > 0) setSelected(formatted[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos", err);
        setLoading(false);
      });
  }, []);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };
  const go = (next: Page) => {
    setPage(next);
    setMobileMenu(false);
    setClearConfirm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openProduct = (product: DemoProduct) => {
    setSelected(product);
    setDetailView(0);
    go("Detalle");
  };
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(next);
    notify(next.includes(id) ? "Guardado en favoritos · solo en esta vista" : "Retirado de favoritos");
  };
  const addToCart = (product: DemoProduct) => {
    if (product.stock <= 0) {
      notify("Esta referencia figura agotada en la DEMO");
      return;
    }
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    notify(`${product.name} agregado · carrito no persistente`);
  };
  const changeQuantity = (id: string, amount: number) => {
    setCart((current) => {
      const next = { ...current };
      const updated = (next[id] ?? 0) + amount;
      if (updated <= 0) delete next[id];
      else next[id] = updated;
      return next;
    });
  };
  const cartItems = productsData.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);
  const visibleProducts = productsData
    .filter((product) => family === "Todas las familias" || product.category === family)
    .filter((product) => audience === "Todos" || product.audience === audience)
    .filter((product) => brand === "Todas las marcas" || product.brand === brand)
    .filter((product) => {
      if (priceRange === "Menos de $160.000") return product.price < 160000;
      if (priceRange === "$160.000 a $200.000") return product.price >= 160000 && product.price <= 200000;
      if (priceRange === "Más de $200.000") return product.price > 200000;
      return true;
    })
    .filter((product) => availability === "Disponibles" ? product.stock > 0 : availability === "Agotados" ? product.stock === 0 : true)
    .filter((product) => !favoritesOnly || favorites.includes(product.id))
    .filter((product) => `${product.name} ${product.reference} ${product.brand} ${product.audience} ${product.category} ${product.notes.join(" ")}`.toLowerCase().includes(search.toLowerCase().trim()))
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name, "es");
      return Number(b.featured) - Number(a.featured) || a.id.localeCompare(b.id);
    });

  const navTo = (item: Page) => {
    if (item === "Carrito") go("Carrito");
    else go(item);
  };

  const clearFilters = () => {
    setSearch("");
    setFamily("Todas las familias");
    setAudience("Todos");
    setBrand("Todas las marcas");
    setPriceRange("Todos los precios");
    setAvailability("Todas");
    setFavoritesOnly(false);
  };

  const renderProductGrid = (products: DemoProduct[]) => (
    <div className="tp-product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          view={cardViews[product.id] ?? 0}
          setView={(view) => setCardViews((current) => ({ ...current, [product.id]: view }))}
          favorite={favorites.includes(product.id)}
          onFavorite={() => toggleFavorite(product.id)}
          onOpen={() => openProduct(product)}
          onAdd={() => addToCart(product)}
          added={Boolean(cart[product.id])}
        />
      ))}
    </div>
  );

  const renderCatalog = (home = false) => {
    const products = home ? visibleProducts.filter((product) => product.featured).slice(0, 4) : visibleProducts;
    return (
      <section className="tp-catalog-section" id="catalogo">
        <div className="tp-section-heading">
          <div>
            <div className="tp-eyebrow"><span className="tp-eyebrow-line" /> {home ? "FRAGANCIAS SELECCIONADAS · DEMO" : "DESCUBRE TU PRÓXIMA FRAGANCIA"}</div>
            <h2>{home ? <>Nuestro <em>Catálogo</em></> : <>Encuentra tu <em>fragancia</em></>}</h2>
          </div>
          {home ? (
            <button type="button" className="tp-text-link" onClick={() => go("Catálogo")}>Ver todo el catálogo <span className="tp-round-arrow"><ArrowRight size={14} /></span></button>
          ) : <p className="tp-section-note">12 referencias ficticias para explorar esta experiencia visual.</p>}
        </div>
        {!home && (
          <>
            <div className="tp-audience-filter" role="group" aria-label="¿Para quién?">
              <span>¿Para quién?</span>
              {demoAudiences.map((item) => <button key={item} type="button" className={audience === item ? "is-active" : ""} aria-pressed={audience === item} onClick={() => setAudience(item)}>{item}</button>)}
            </div>
            <div className="tp-catalog-tools">
              <label className="tp-filter-select"><span>Marca</span><select value={brand} onChange={(event) => setBrand(event.target.value)}><option>Todas las marcas</option>{demoBrands.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></label>
              <label className="tp-filter-select"><span>Precio</span><select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}><option>Todos los precios</option><option>Menos de $160.000</option><option>$160.000 a $200.000</option><option>Más de $200.000</option></select><ChevronDown size={13} /></label>
              <label className="tp-filter-select"><span>Disponibilidad</span><select value={availability} onChange={(event) => setAvailability(event.target.value)}><option>Todas</option><option>Disponibles</option><option>Agotados</option></select><ChevronDown size={13} /></label>
              <button type="button" className={`tp-filter-chip ${favoritesOnly ? "is-selected" : ""}`} onClick={() => setFavoritesOnly(!favoritesOnly)}><Heart size={14} fill={favoritesOnly ? "currentColor" : "none"} /> Favoritos <span>{favorites.length}</span></button>
              <label className="tp-sort"><ArrowDownWideNarrow size={15} /><select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="Ordenar productos"><option value="featured">Destacados</option><option value="price-low">Precio: menor a mayor</option><option value="price-high">Precio: mayor a menor</option><option value="name">Nombre A–Z</option></select><ChevronDown size={14} /></label>
            </div>
          </>
        )}
        {!home && <div className="tp-family-list" aria-label="Filtrar por familia olfativa">{demoCategories.map((category) => <button key={category} type="button" onClick={() => setFamily(category)} className={family === category ? "is-active" : ""}>{category}</button>)}</div>}
        {!home && <div className="tp-results-line"><span>{products.length.toString().padStart(2, "0")} FRAGANCIAS</span><span>PRECIOS Y DISPONIBILIDAD FICTICIOS · DEMO</span></div>}
        {products.length ? renderProductGrid(products) : (
          <div className="tp-empty-state"><Sparkles size={22} /><h3>Sin coincidencias por ahora.</h3><p>Prueba otra nota, familia o filtro.</p><button type="button" onClick={clearFilters}>Limpiar filtros <ArrowRight size={14} /></button></div>
        )}
      </section>
    );
  };

  const renderHome = () => (
    <>
      <section className="tp-hero">
        <div className="tp-hero-copy">
          <div className="tp-eyebrow"><span className="tp-eyebrow-line" /> ESENCIA QUE INSPIRA</div>
          <h1>Fragancias que<br /><em>Dejan Huella</em></h1>
          <p>Descubre el poder de un aroma único y hazlo parte de tu historia.</p>
          <div className="tp-hero-actions"><button type="button" className="tp-button-primary" onClick={() => go("Catálogo")}>Explorar Catálogo <ArrowRight size={16} /></button></div>
        </div>
        <div className="tp-hero-indicators" aria-label="Indicadores visuales de la portada"><span className="is-active" /><span /><span /><span /></div>
      </section>
      {renderCatalog(true)}
      <section className="tp-benefits" aria-label="Beneficios de la tienda">
        <div className="tp-benefit"><Truck size={27} /><span><strong>Envíos a todo el país</strong><small>3 a 4 días hábiles · DEMO</small></span></div>
        <div className="tp-benefit"><ShieldCheck size={27} /><span><strong>Compra segura</strong><small>Prototipo visual · sin transacciones</small></span></div>
        <div className="tp-benefit"><Headphones size={27} /><span><strong>Atención personalizada</strong><small>Canal de atención por configurar</small></span></div>
        <button type="button" className="tp-whatsapp-demo" onClick={() => notify("WhatsApp es solo demostrativo en esta fase.")}><MessageCircle size={19} /><span>Comprar por WhatsApp</span><ArrowRight size={16} /></button>
      </section>
      <section className="tp-discovery">
        <div className="tp-discovery-visual">
          <div className="tp-discovery-halo" />
          <div className="tp-discovery-number">01</div>
          <div className="tp-note-orbit orbit-a">FLORAL</div>
          <div className="tp-note-orbit orbit-b">FRESCA</div>
          <div className="tp-note-orbit orbit-c">AMADERADA</div>
          <PerfumeBottle tone="#a782d0" view={0} label="Perfume ilustrativo" className="tp-discovery-bottle" />
        </div>
        <div className="tp-discovery-copy">
          <div className="tp-eyebrow"><span className="tp-eyebrow-line" /> UNA GUÍA SIN PRISA</div>
          <h2>El perfume no se elige.<br /><em>Te encuentra.</em></h2>
          <p>Empieza por las notas que te atraen, las sensaciones que quieres llevar contigo y la familia olfativa que mejor expresa tu personalidad.</p>
          <button type="button" className="tp-button-outline" onClick={() => { setFamily("Todas las familias"); go("Catálogo"); }}>Encuentra tu familia <ArrowRight size={15} /></button>
          <span className="tp-discovery-foot">EXPLORA LAS FAMILIAS OLFATIVAS · DEMO</span>
        </div>
      </section>
      <section className="tp-quote-band">
        <div className="tp-quote-mark">“</div>
        <p>Una fragancia es un lugar<br />al que siempre puedes volver</p>
        <div className="tp-quote-caption">TU PERFUMERÍA <span>—</span> UNA IDEA PARA EXPLORAR</div>
      </section>
      <section className="tp-family-preview">
        <div className="tp-family-preview-head">
          <div><div className="tp-eyebrow"><span className="tp-eyebrow-line" /> EXPLORA POR SENSACIÓN</div><h2>¿Qué te <em>llama?</em></h2></div>
          <button type="button" className="tp-text-link" onClick={() => { setFamily("Todas las familias"); go("Catálogo"); }}>Ver todas las familias <ArrowRight size={15} /></button>
        </div>
        <div className="tp-family-tiles">{["Floral", "Oriental", "Fresca", "Amaderada", "Cítrica", "Dulce"].map((item, index) => <button type="button" key={item} className={`tp-family-tile family-${index}`} onClick={() => { setFamily(item); go("Catálogo"); }}><span>0{index + 1}</span><strong>{item}</strong><ArrowUpRight size={17} /></button>)}</div>
      </section>
    </>
  );

  const renderDetail = () => (
    <section className="tp-detail-page">
      <div className="tp-breadcrumb"><button type="button" onClick={() => go("Inicio")}>Inicio</button><span>/</span><button type="button" onClick={() => go("Catálogo")}>Catálogo</button><span>/</span><span>{selected.name}</span></div>
      <div className="tp-detail-layout">
        <div className="tp-detail-gallery"><Gallery product={selected} view={detailView} setView={setDetailView} /><div className="tp-gallery-labels">{demoGalleryViews.map((label, index) => <button key={label} type="button" className={detailView === index ? "is-active" : ""} onClick={() => setDetailView(index)}><span>0{index + 1}</span>{label}</button>)}</div><span className="tp-swipe-hint">← DESLIZA O USA LAS FLECHAS DEL TECLADO →</span></div>
        <div className="tp-detail-info"><div className="tp-eyebrow"><span className="tp-eyebrow-line" /> {selected.category.toUpperCase()} · {selected.reference} · DEMO</div><h1>{selected.name}<em>DEMO</em></h1><div className="tp-detail-rule" /><p className="tp-detail-desc">{selected.description} Una lectura sensorial provisional, creada para esta experiencia de demostración.</p><div className="tp-detail-tags">{selected.notes.map((note) => <span key={note}>{note}</span>)}</div><div className="tp-detail-specs"><div><span>CONCENTRACIÓN</span><strong>{selected.concentration}</strong></div><div><span>CONTENIDO</span><strong>{selected.size}</strong></div><div><span>FAMILIA</span><strong>{selected.category}</strong></div></div><div className="tp-detail-price">{formatCop(selected.price)} <DemoFlag>PRECIO DEMO</DemoFlag></div><div className="tp-detail-stock"><span className={selected.stock ? "tp-stock-dot" : "tp-stock-dot out"} />{selected.status} · stock ficticio: {selected.stock}</div><div className="tp-detail-actions"><button type="button" className="tp-button-primary" onClick={() => addToCart(selected)} disabled={selected.stock === 0}>{selected.stock === 0 ? "Agotado en DEMO" : "Agregar al carrito"} <ShoppingBag size={16} /></button><button type="button" className={`tp-detail-fav ${favorites.includes(selected.id) ? "is-favorite" : ""}`} onClick={() => toggleFavorite(selected.id)} aria-label="Guardar en favoritos"><Heart size={19} fill={favorites.includes(selected.id) ? "currentColor" : "none"} /></button></div><p className="tp-demo-disclaimer"><ShieldCheck size={14} /> Compra y disponibilidad no reales. Prototipo no transaccional.</p><button type="button" className="tp-next-product" onClick={() => openProduct(productsData[(productsData.findIndex((item) => item.id === selected.id) + 1) % productsData.length])}>SIGUIENTE FRAGANCIA <ArrowRight size={14} /></button></div>
      </div>
    </section>
  );

  const renderCart = () => (
    <section className="tp-page-shell tp-cart-page">
      <div className="tp-eyebrow"><span className="tp-eyebrow-line" /> TU SELECCIÓN · NO PERSISTENTE</div><h1>Tu <em>carrito.</em></h1>
      <div className="tp-cart-layout"><div className="tp-cart-items">
        {cartItems.length ? cartItems.map((product) => (
          <div className="tp-cart-row" key={product.id}><div className="tp-cart-thumb"><PerfumeBottle tone={product.tone} view={0} label={product.name} /></div><div className="tp-cart-product"><span>{product.category} · {product.reference}</span><button type="button" onClick={() => openProduct(product)}>{product.name} <DemoFlag /></button><small>{product.size} · {product.concentration}</small></div><div className="tp-quantity"><button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label="Restar cantidad"><Minus size={14} /></button><span>{cart[product.id]}</span><button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label="Sumar cantidad"><Plus size={14} /></button></div><div className="tp-cart-price">{formatCop(product.price * (cart[product.id] ?? 0))}<small>SUBTOTAL DEMO</small></div><button type="button" className="tp-remove-item" onClick={() => setCart((current) => { const next = { ...current }; delete next[product.id]; return next; })} aria-label={`Eliminar ${product.name}`}><Trash2 size={16} /></button></div>
        )) : <div className="tp-cart-empty"><ShoppingBag size={27} /><h2>Tu carrito está en pausa.</h2><p>Explora las fragancias y guarda aquí tus favoritas para esta sesión.</p><button type="button" className="tp-button-outline" onClick={() => go("Catálogo")}>Ir al catálogo <ArrowRight size={15} /></button></div>}
        {cartItems.length > 0 && <div className="tp-cart-controls"><button type="button" className="tp-text-link" onClick={() => go("Catálogo")}><ArrowLeft size={14} /> Seguir explorando</button><button type="button" className="tp-clear-cart" onClick={() => setClearConfirm(true)}><Trash2 size={14} /> Vaciar carrito</button></div>}
      </div><aside className="tp-cart-summary"><span className="tp-summary-kicker">RESUMEN · DEMO</span><div className="tp-summary-line"><span>Productos ({cartCount})</span><strong>{formatCop(subtotal)}</strong></div><div className="tp-summary-shipping">+ envío según ubicación</div><div className="tp-summary-total"><span>Subtotal de productos</span><strong>{formatCop(subtotal)}</strong></div><button type="button" className="tp-button-primary tp-checkout-button" disabled={!cartCount} onClick={() => go("Checkout")}>Continuar a demostración <ArrowRight size={16} /></button><p><ShieldCheck size={14} /> No se realizará ningún pago ni pedido.</p><div className="tp-summary-delivery"><Truck size={16} /><span>{deliveryCopy}</span></div></aside></div>
      {clearConfirm && <div className="tp-confirm-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setClearConfirm(false); }}><div className="tp-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="clear-title"><button type="button" className="tp-dialog-close" onClick={() => setClearConfirm(false)} aria-label="Cerrar"><X size={18} /></button><div className="tp-dialog-icon"><Trash2 size={20} /></div><h2 id="clear-title">¿Empezar de nuevo?</h2><p>Esto quitará todos los productos de tu carrito de demostración.</p><div><button type="button" className="tp-button-quiet" onClick={() => setClearConfirm(false)}>Conservar selección</button><button type="button" className="tp-button-primary" onClick={() => { setCart({}); setClearConfirm(false); notify("Carrito vacío · cambio solo local"); }}>Sí, vaciar carrito</button></div></div></div>}
    </section>
  );
  
  const renderCheckout = () => (
    <section className="tp-page-shell tp-checkout-page"><div className="tp-eyebrow"><span className="tp-eyebrow-line" /> RECORRIDO VISUAL · SIN TRANSACCIÓN</div><h1>Una pausa antes<br /><em>de continuar.</em></h1><div className="tp-checkout-banner"><CircleHelp size={18} /><div><strong>Esta pantalla es únicamente una demostración.</strong><span>No se crea un pedido, no se solicitan datos financieros y no se envía información.</span></div><DemoFlag>NO CONFIGURADO</DemoFlag></div><div className="tp-checkout-layout"><div className="tp-checkout-main"><div className="tp-stepper"><div className="is-current"><span>01</span><b>Revisión</b></div><i /><div><span>02</span><b>Entrega</b></div><i /><div><span>03</span><b>Confirmación</b></div></div><div className="tp-checkout-panel"><span className="tp-summary-kicker">PASO 01 · REVISIÓN DE LA DEMO</span><h2>Todo listo para imaginar.</h2><p>Tu selección permanece solo en esta pantalla. La tienda aún no tiene pagos ni pedidos configurados.</p><div className="tp-checkout-recap">{cartItems.map((product) => <div key={product.id}><span>{cart[product.id]} × {product.name} <DemoFlag /></span><strong>{formatCop(product.price * cart[product.id])}</strong></div>)}{!cartItems.length && <span>Tu carrito está vacío.</span>}</div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      <input 
        placeholder="Nombre completo" 
        value={checkoutData.name} 
        onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})}
        style={{ padding: '10px', background: '#1b1821', border: '1px solid #39333f', color: '#fff', borderRadius: '4px' }}
      />
      <input 
        placeholder="Teléfono de contacto" 
        value={checkoutData.phone} 
        onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
        style={{ padding: '10px', background: '#1b1821', border: '1px solid #39333f', color: '#fff', borderRadius: '4px' }}
      />
      <input 
        placeholder="Ciudad" 
        value={checkoutData.city} 
        onChange={(e) => setCheckoutData({...checkoutData, city: e.target.value})}
        style={{ padding: '10px', background: '#1b1821', border: '1px solid #39333f', color: '#fff', borderRadius: '4px' }}
      />
      <input 
        placeholder="Dirección de entrega" 
        value={checkoutData.address} 
        onChange={(e) => setCheckoutData({...checkoutData, address: e.target.value})}
        style={{ padding: '10px', background: '#1b1821', border: '1px solid #39333f', color: '#fff', borderRadius: '4px' }}/>
    </div>

  <button 
    type="button" 
    className={`tp-button-primary ${checkoutChecked ? "is-complete" : ""}`} 
    onClick={async () => {
      if (!checkoutData.name || !checkoutData.phone || !checkoutData.address) {
        notify("Por favor completa los datos de envío.");
        return;
      }
      
      try {
        // Aquí conectaremos con la API para guardar en la base de datos
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: checkoutData.name,
            customerPhone: checkoutData.phone,
            customerCity: checkoutData.city,
            customerAddress: checkoutData.address,
            paymentMethod: "Nequi", // Temporal
            items: cartItems.map(item => ({
              productName: item.name,
              reference: item.reference,
              quantity: cart[item.id],
              unitPrice: item.price,
              subtotal: item.price * cart[item.id]
            }))
          })
        }); 
        const data = await response.json();// <--- AGREGA ESTO AQUÍ

        if (response.ok) {
          setCheckoutChecked(true);
        notify("Pedido guardado. Abriendo WhatsApp...");

        // Construir el mensaje de WhatsApp
        const mensaje = `Hola, acabo de hacer un pedido en la tienda.%0A%0A` +
          `*Número de pedido:* ${data.orderNumber}%0A` +
          `*Nombre:* ${checkoutData.name}%0A` +
          `*Teléfono:* ${checkoutData.phone}%0A` +
          `*Ciudad:* ${checkoutData.city}%0A` +
          `*Dirección:* ${checkoutData.address}%0A%0A` +
          `*Productos:*%0A` +
          cartItems.map(item => `- ${cart[item.id]}x ${item.name} (${item.reference}) - $${item.price * cart[item.id]}`).join('%0A') +
          `%0A%0A*Subtotal:* $${subtotal.toLocaleString('es-CO')}%0A` +
          `*+ envío según ubicación*`;

        // Abrir WhatsApp (reemplaza el número por el de la tienda)
        const numeroWhatsApp = "573238016233"; // Pon aquí el número de la tienda
        window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
          // Aquí iría el código para abrir WhatsApp
        } else {
          notify("Error al guardar el pedido. Intenta de nuevo.");
        }
      } catch (error) {
        notify("Error de conexión.");
      }
    }}
  >
    {checkoutChecked ? <><Check size={16} /> Pedido Guardado</> : <>Confirmar Pedido <ArrowRight size={16} /></>}
</button>
    
    {checkoutChecked && <div className="tp-inline-feedback"><Check size={15} /> Vista completada. No se registró ninguna compra.</div>}</div></div><aside className="tp-checkout-aside"><span className="tp-summary-kicker">RESUMEN FICTICIO</span><div className="tp-summary-line"><span>Subtotal de productos</span><strong>{formatCop(subtotal)}</strong></div><div className="tp-summary-shipping">+ envío según ubicación</div><p>{deliveryCopy}</p><div className="tp-payment-visual"><CreditCard size={18} /><span>Medios de pago</span><DemoFlag>NO CONFIGURADO</DemoFlag></div></aside></div><button type="button" className="tp-text-link tp-back-cart" onClick={() => go("Carrito")}><ArrowLeft size={14} /> Volver al carrito</button></section>
  );

  const renderBrand = () => (
    <section className="tp-brand-page tp-page-shell"><div className="tp-eyebrow"><span className="tp-eyebrow-line" /> UNA MARCA PROVISIONAL</div><h1>Un universo<br />por <em>descubrir.</em></h1><div className="tp-brand-story"><div className="tp-brand-abstract"><span>TP</span><div className="tp-brand-ring ring-1" /><div className="tp-brand-ring ring-2" /><div className="tp-brand-ring ring-3" /><small>IDENTIDAD EN EXPLORACIÓN · DEMO</small></div><div className="tp-brand-text"><span>NO ES UNA HISTORIA DEFINITIVA</span><h2>Un nombre para<br />seguir el rastro.</h2><p>Tu Perfumería es una tienda de perfumes colombiana en etapa de concepto. Esta experiencia imagina un espacio para descubrir fragancias con calma, curiosidad y una mirada contemporánea.</p><p>La identidad, el catálogo y los relatos que lees aquí son material ficticio para un prototipo visual. No representan una marca, producto ni operación comercial configurada.</p><button type="button" className="tp-button-outline" onClick={() => go("Catálogo")}>Explorar el concepto <ArrowRight size={15} /></button></div></div><div className="tp-brand-values"><div><span>01</span><strong>Curiosidad</strong><p>Explorar antes de elegir.</p></div><div><span>02</span><strong>Sensibilidad</strong><p>Las notas también cuentan.</p></div><div><span>03</span><strong>Intención</strong><p>Una estela propia, sin prisa.</p></div></div><div className="tp-brand-note"><Sparkles size={17} /><span>Nombre, narrativa y propuesta comercial provisionales. DEMO sin historia definitiva.</span></div></section>
  );

  const renderDelivery = () => (
    <section className="tp-page-shell tp-info-page"><div className="tp-eyebrow"><span className="tp-eyebrow-line" /> INFORMACIÓN DE LA EXPERIENCIA</div><h1>Antes de<br /><em>imaginar tu pedido.</em></h1><p className="tp-info-intro">El prototipo presenta una estimación de referencia. No hay operador logístico ni métodos de pago configurados.</p><div className="tp-info-cards"><article className="tp-info-card tp-info-delivery"><span className="tp-info-index">01 / ENTREGA</span><div className="tp-info-icon"><Truck size={21} /></div><h2>Una referencia<br />para esta demo.</h2><p>{deliveryCopy}</p><DemoFlag>ESTIMACIÓN DEMO</DemoFlag></article><article className="tp-info-card"><span className="tp-info-index">02 / PAGOS</span><div className="tp-info-icon"><CreditCard size={21} /></div><h2>Métodos aún<br />no configurados.</h2><p>Esta tienda no recibe pagos. No introduzcas datos de tarjetas ni cuentas.</p><DemoFlag>NO CONFIGURADO</DemoFlag></article><article className="tp-info-card"><span className="tp-info-index">03 / PROTOTIPO</span><div className="tp-info-icon"><ShieldCheck size={21} /></div><h2>Solo una<br />experiencia visual.</h2><p>Los precios, disponibilidad y referencias son ficticios. No se confirma ni se despacha ningún pedido.</p><DemoFlag>NO TRANSACCIONAL</DemoFlag></article></div><button type="button" className="tp-button-outline" onClick={() => go("Contacto")}>¿Tienes una pregunta? <ArrowRight size={15} /></button></section>
  );

  const renderContact = () => (
    <section className="tp-page-shell tp-contact-page"><div className="tp-eyebrow"><span className="tp-eyebrow-line" /> PUNTO DE CONTACTO · DEMO</div><h1>Hablemos<br /><em>de aromas.</em></h1><div className="tp-contact-card"><div className="tp-contact-card-art"><Mail size={30} /><span>UN ESPACIO<br />POR CONFIGURAR</span></div><div className="tp-contact-copy"><DemoFlag>CANAL NO CONFIGURADO</DemoFlag><h2>Estamos preparando<br />este espacio.</h2><p>En una tienda activa aquí encontrarás canales de atención. Este prototipo no tiene correo, teléfono, WhatsApp ni redes sociales configuradas.</p><button type="button" className="tp-button-outline" onClick={() => notify("Canal de contacto no configurado en esta DEMO")}><Mail size={15} /> Ver estado de contacto</button><span className="tp-contact-micro">NO SE ENVÍA NINGÚN MENSAJE</span></div></div><div className="tp-contact-bottom"><span>PRÓXIMAMENTE, EN ESTA HISTORIA.</span><span>BOGOTÁ · COLOMBIA · DEMO</span></div></section>
  );

  if (loading) return <div style={{ color: 'white', padding: '50px' }}>Cargando tienda...</div>;
  if (!selected) return <div style={{ color: 'white', padding: '50px' }}>No hay productos disponibles.</div>;

  const mainContent = () => {
    switch (page) {
      case "Inicio": return renderHome();
      case "Catálogo": return <div className="tp-catalog-page">{renderCatalog(false)}</div>;
      case "Detalle": return renderDetail();
      case "Marca": return renderBrand();
      case "Envíos y pagos": return renderDelivery();
      case "Contacto": return renderContact();
      case "Carrito": return renderCart();
      case "Checkout": return renderCheckout();
      case "Administración": return null;
    }
  };

  if (page === "Administración") {
    return <div className="tp-root"><style>{styles}</style><Admin initialLogin onExit={() => go("Inicio")} /></div>;
  }

  return (
    <div className="tp-root">
      <style>{styles}</style>
      <header className="tp-header">
        <button type="button" className="tp-brand-lockup" onClick={() => go("Inicio")} aria-label="Tu Perfumería, inicio"><span className="tp-brand-symbol"><Flower2 size={30} strokeWidth={1.25} /></span><span className="tp-brand-wordmark">Tu Perfumería<small>ESENCIA QUE INSPIRA</small></span></button>
        <nav className={`tp-nav ${mobileMenu ? "is-open" : ""}`} aria-label="Navegación principal">{publicPages.map(({ label, page: target }) => <button type="button" key={label} className={page === target || (label === "Catálogo" && page === "Detalle") ? "is-current" : ""} onClick={() => navTo(target)}>{label}</button>)}</nav>
        <form className="tp-header-search" onSubmit={(event) => { event.preventDefault(); go("Catálogo"); }}>
          <button type="submit" aria-label="Buscar"><Search size={16} /></button>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar fragancia..." aria-label="Buscar fragancia" />
        </form>
        <div className="tp-header-actions">
          <button type="button" className="tp-account-button" onClick={() => go("Administración")} aria-label="Acceso administrativo DEMO"><UserRound size={20} /></button>
          <button type="button" className="tp-cart-button" onClick={() => go("Carrito")} aria-label={`Carrito, ${cartCount} productos`}><ShoppingBag size={19} /><b>{cartCount}</b></button>
          <button type="button" className="tp-mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label={mobileMenu ? "Cerrar menú" : "Abrir menú"}>{mobileMenu ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>
      <main className="tp-main">{mainContent()}</main>
      <footer className="tp-footer">
        <div className="tp-footer-main">
          <button type="button" className="tp-brand-lockup" onClick={() => go("Inicio")}><span className="tp-brand-symbol"><Flower2 size={31} strokeWidth={1.25} /></span><span className="tp-brand-wordmark">Tu Perfumería<small>BELLEZA EN CADA DETALLE</small></span></button>
          <div className="tp-footer-legal"><button type="button" onClick={() => notify("Términos provisionales · tienda DEMO")}>Términos y condiciones</button><button type="button" onClick={() => notify("Política de privacidad por configurar · DEMO")}>Políticas de privacidad</button><button type="button" onClick={() => notify("Preguntas frecuentes por configurar · DEMO")}>Preguntas frecuentes</button></div>
          <div className="tp-footer-social"><span>SÍGUENOS</span><button aria-label="Facebook, enlace no configurado" onClick={() => notify("Redes sociales no configuradas en esta DEMO.")}><Facebook size={16} /></button><button aria-label="Instagram, enlace no configurado" onClick={() => notify("Redes sociales no configuradas en esta DEMO.")}><Instagram size={16} /></button><button aria-label="TikTok, enlace no configurado" onClick={() => notify("Redes sociales no configuradas en esta DEMO.")}><Music2 size={16} /></button><button aria-label="YouTube, enlace no configurado" onClick={() => notify("Redes sociales no configuradas en esta DEMO.")}><Youtube size={16} /></button></div>
        </div>
        <div className="tp-footer-bottom"><span>© TU PERFUMERÍA · PROTOTIPO VISUAL NO TRANSACCIONAL</span><span>CONTENIDO FICTICIO · DEMO</span><button type="button" onClick={() => go("Envíos y pagos")}>Información de envíos</button></div>
      </footer>
      {toast && <div className="tp-toast" role="status"><Check size={15} />{toast}<button type="button" onClick={() => setToast("")} aria-label="Cerrar aviso"><X size={14} /></button></div>}
    </div>
  );
}

const styles = `
.tp-root {
  --tp-ink: #09090c;
  --tp-surface: #111116;
  --tp-raised: #19181f;
  --tp-line: rgba(226,216,197,.14);
  --tp-paper: #f3eee6;
  --tp-muted: #a19ba8;
  --tp-violet: #a27be2;
  --tp-violet-bright: #c9b1fa;
  --tp-champagne: #d9c495;
  background: #09090c;
  color: var(--tp-paper);
  font-family: "DM Sans", "Avenir Next", Avenir, ui-sans-serif, system-ui, sans-serif;
  min-height: 100vh;
  overflow: hidden;
  font-synthesis: none;
}
.tp-root button { cursor: pointer; }
.tp-root button:disabled { cursor: not-allowed; opacity: .45; }
.tp-root button, .tp-root input, .tp-root select { color: inherit; }
.tp-demo-ribbon { min-height: 32px; padding: 0 3.7%; display:flex; align-items:center; justify-content:space-between; gap:20px; background:#17151c; color:#c7bdad; font: 8px/1.2 "SFMono-Regular",Consolas,monospace; letter-spacing:1.05px; border-bottom:1px solid rgba(226,216,197,.08); }
.tp-demo-ribbon > span:first-child { color:var(--tp-champagne); display:flex; gap:8px; align-items:center; white-space:nowrap; }
.tp-ribbon-dot { width:5px;height:5px;background:#be9c54;border-radius:50%;display:inline-block;box-shadow:0 0 0 3px #be9c5420; }
.tp-demo-ribbon button { display:flex; align-items:center; gap:5px; border:0; background:none; color:#e8e0d5; font:inherit; letter-spacing:inherit; white-space:nowrap; }
.tp-header { height:76px; padding:0 4%; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--tp-line); position:relative; z-index:10; background:#0b0a0e; }
.tp-brand-lockup { display:flex; align-items:center; gap:11px; border:0; background:none; padding:0; text-align:left; flex-shrink:0; }
.tp-brand-symbol { width:30px;height:31px;display:flex;align-items:center;justify-content:center;gap:3px;border:1px solid rgba(217,196,149,.46);transform:rotate(45deg); }
.tp-brand-symbol i { display:block;width:2px;height:13px;background:var(--tp-champagne);transform:rotate(-45deg); }
.tp-brand-symbol i:nth-child(2) { height:18px; background:#ad87e5; }
.tp-brand-symbol i:nth-child(3) { height:9px; }
.tp-brand-wordmark { font: 20px/1 Georgia,"Times New Roman",serif; letter-spacing:-.7px; white-space:nowrap; }
.tp-brand-wordmark small { display:block; margin-top:5px; font:7px/1 "SFMono-Regular",Consolas,monospace; letter-spacing:1.6px; color:#a49ca9; }
.tp-nav { display:flex; align-items:center; gap:clamp(14px,2vw,32px); margin-left:auto; margin-right:clamp(22px,4vw,70px); }
.tp-nav button { position:relative; padding:9px 0; background:none; border:0; color:#aaa4ae; font-size:11px; transition:color .2s ease; white-space:nowrap; }
.tp-nav button:hover,.tp-nav button.is-current { color:var(--tp-paper); }
.tp-nav button.is-current::after { position:absolute;content:"";height:1px;left:0;right:0;bottom:2px;background:var(--tp-champagne); }
.tp-header-actions { display:flex;align-items:center;gap:20px; }
.tp-header-fav,.tp-cart-button { display:flex;align-items:center;gap:9px;background:none;border:0;color:#e4dce1; }
.tp-header-fav span { color:var(--tp-champagne);font:10px "SFMono-Regular",Consolas,monospace; }
.tp-cart-button { height:39px;padding:0 12px;border:1px solid rgba(217,196,149,.48);font-size:11px; }
.tp-cart-button b { display:flex;align-items:center;justify-content:center;min-width:20px;height:20px;border-radius:50%;background:#d9c495;color:#16131b;font:9px "SFMono-Regular",Consolas,monospace; }
.tp-mobile-toggle { display:none;background:none;border:0;padding:5px; }
.tp-main { min-height:390px; }
.tp-hero { min-height:600px; height:min(52vw,690px); max-height:730px; padding:0 8.1%; position:relative; display:grid; grid-template-columns:1fr 1fr; align-items:center; overflow:hidden; border-bottom:1px solid var(--tp-line); }
.tp-hero::before { content:""; position:absolute; inset:0; pointer-events:none; background:radial-gradient(ellipse at 76% 47%,rgba(100,60,132,.12),transparent 39%),linear-gradient(90deg,#09090c 0%,rgba(9,9,12,.94) 41%,rgba(9,9,12,.13) 100%); }
.tp-hero-copy { position:relative;z-index:2;max-width:590px;padding-bottom:22px; }
.tp-eyebrow { display:flex;align-items:center;gap:11px;color:var(--tp-champagne);font:9px/1.4 "SFMono-Regular",Consolas,monospace;letter-spacing:1.6px; }
.tp-eyebrow-line { width:27px;height:1px;background:var(--tp-champagne);display:inline-block; }
.tp-hero h1,.tp-page-shell h1,.tp-detail-info h1 { margin:28px 0 20px;font:clamp(54px,7.2vw,102px)/.93 Georgia,"Times New Roman",serif;letter-spacing:-4.3px;font-weight:400; }
.tp-hero h1 em,.tp-section-heading h2 em,.tp-discovery h2 em,.tp-family-preview h2 em,.tp-page-shell h1 em,.tp-detail-info h1 em { color:var(--tp-violet-bright);font-weight:400; }
.tp-hero-copy > p { max-width:410px;margin:0;color:#b2abb6;font-size:14px;line-height:1.9; }
.tp-hero-actions { display:flex;align-items:center;gap:28px;margin-top:32px; }
.tp-button-primary,.tp-button-outline,.tp-button-quiet { display:inline-flex;justify-content:center;align-items:center;gap:16px;min-height:47px;padding:0 19px;text-decoration:none;border:1px solid transparent;font-size:11px;transition:background .2s ease,color .2s ease,border-color .2s ease; }
.tp-button-primary { background:var(--tp-champagne);color:#17141a!important;border-color:var(--tp-champagne); }
.tp-button-primary:hover { background:#e9d8ad; }
.tp-button-primary.is-complete { background:#81715a;border-color:#81715a;color:#fff!important; }
.tp-button-outline { background:transparent;border-color:rgba(217,196,149,.55);color:var(--tp-paper); }
.tp-button-outline:hover { background:#d9c495;color:#16131b; }
.tp-button-quiet { background:none;color:#e6dfe5;padding-left:0;padding-right:0;min-height:40px; }
.tp-button-quiet:hover,.tp-text-link:hover { color:var(--tp-champagne); }
.tp-hero-proof { display:flex;align-items:center;gap:10px;margin-top:63px;color:#89838e;font:8px "SFMono-Regular",Consolas,monospace;letter-spacing:.55px; }
.tp-hero-proof i { width:3px;height:3px;background:var(--tp-champagne);border-radius:50%;margin:0 3px; }
.tp-proof-mark { display:flex;gap:3px;align-items:end;height:16px; }
.tp-proof-mark span { width:2px;background:var(--tp-violet);height:8px;transform:skew(-18deg); }
.tp-proof-mark span:nth-child(2){height:15px;background:var(--tp-champagne)}.tp-proof-mark span:nth-child(3){height:11px}
.tp-hero-art { align-self:stretch;position:relative;display:flex;align-items:center;justify-content:center; }
.tp-hero-disc { position:absolute;width:min(35vw,440px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 49% 52%,rgba(142,106,180,.21),rgba(57,39,75,.1) 45%,transparent 69%);border:1px solid rgba(195,158,214,.1); }
.tp-hero-orbit { position:absolute;width:min(39vw,500px);aspect-ratio:1;border:1px solid rgba(208,185,226,.13);border-radius:50%;transform:rotate(-24deg) scaleY(.57); }
.tp-orbit-two { width:min(47vw,610px);border-color:rgba(217,196,149,.1);transform:rotate(28deg) scaleY(.53); }
.tp-hero-bottle { position:relative;z-index:1;width:min(35vw,390px);height:auto;filter:drop-shadow(0 25px 38px rgba(0,0,0,.52)); }
.tp-hero-art-label { position:absolute;top:18%;left:3%;display:flex;flex-direction:column;gap:9px;color:#b4a6bb;font:8px/1.6 "SFMono-Regular",Consolas,monospace;letter-spacing:1.3px; }
.tp-hero-art-label span:first-child { color:var(--tp-champagne); }
.tp-hero-float { position:absolute;z-index:2;font:8px "SFMono-Regular",Consolas,monospace;letter-spacing:1px;color:#e8dfeb; }
.tp-float-top { right:0;top:22%;display:flex;align-items:center;gap:8px;color:var(--tp-champagne); }
.tp-float-bottom { bottom:20%;right:3%;display:flex;flex-direction:column;gap:7px;text-align:right; }
.tp-float-bottom span { font-size:7px;color:#a59ca9;letter-spacing:1.3px; }
.tp-hero-index { position:absolute;bottom:14%;left:0;color:#8a808e;font:9px "SFMono-Regular",Consolas,monospace;letter-spacing:2px; }
.tp-hero-index span { color:var(--tp-champagne);padding:0 6px; }
.tp-hero-foot { position:absolute;bottom:23px;left:8.1%;right:8.1%;display:flex;align-items:center;gap:12px;color:#706a74;font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:1.4px; }
.tp-scroll-rule { width:45px;height:1px;background:linear-gradient(90deg,var(--tp-champagne),transparent); }
.tp-hero-foot span:last-child { margin-left:auto; }
.tp-marquee { overflow:hidden;height:55px;border-bottom:1px solid var(--tp-line);display:flex;align-items:center;background:#0d0c10; }
.tp-marquee-track { display:flex;align-items:center;justify-content:space-around;gap:44px;min-width:100%;white-space:nowrap;color:#a39aa7;font:9px "SFMono-Regular",Consolas,monospace;letter-spacing:2px; }
.tp-marquee-track b { color:var(--tp-champagne);font-size:12px;font-weight:400; }
.tp-catalog-section { width:92%;max-width:1640px;margin:0 auto;padding:98px 0 112px; }
.tp-section-heading,.tp-family-preview-head { display:flex;align-items:end;justify-content:space-between;margin-bottom:38px; }
.tp-section-heading h2,.tp-discovery h2,.tp-family-preview h2 { margin:19px 0 0;font:clamp(40px,5vw,65px)/.99 Georgia,"Times New Roman",serif;letter-spacing:-2px;font-weight:400; }
.tp-text-link { display:inline-flex;align-items:center;gap:11px;padding:8px 0;border:0;background:none;color:#ded5e2;font-size:10px; }
.tp-section-note { max-width:240px;color:#9a929e;font-size:12px;line-height:1.8; }
.tp-product-grid { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:19px; }
.tp-product-card { min-width:0;background:#111015;border:1px solid rgba(226,216,197,.1);transition:transform .25s ease,border-color .25s ease; }
.tp-product-card:hover { transform:translateY(-4px);border-color:rgba(217,196,149,.35); }
.tp-card-visual { height:clamp(215px,24vw,320px);position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 65%,rgba(91,72,110,.18),transparent 65%),linear-gradient(155deg,#17151b,#100e13 68%); }
.tp-gallery { position:relative;min-height:380px;height:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 56%,rgba(74,53,88,.15),transparent 68%);touch-action:pan-y;outline:none; }
.tp-gallery:focus-visible { outline:1px solid var(--tp-champagne);outline-offset:-3px; }
.tp-gallery-glow { position:absolute;width:75%;height:61%;left:12%;top:19%;border-radius:50%;filter:blur(20px);opacity:.68;pointer-events:none; }
.tp-bottle-art { position:relative;z-index:1;width:min(72%,280px);height:auto;filter:drop-shadow(0 16px 19px rgba(0,0,0,.4));transition:transform .3s ease; }
.tp-product-card:hover .tp-bottle-art { transform:translateY(-4px); }
.tp-gallery-number { position:absolute;top:18px;left:18px;z-index:2;color:#e2cf9c;font:8px "SFMono-Regular",Consolas,monospace;letter-spacing:1px; }
.tp-gallery-number span { color:#827986; }
.tp-art-caption { position:absolute;z-index:2;bottom:31px;left:0;right:0;text-align:center;color:#d9c495;font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:1.5px; }
.tp-gallery-dots { position:absolute;z-index:3;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:6px; }
.tp-gallery-dot { width:5px;height:5px;padding:0;border:0;border-radius:50%;background:#6b626d; }
.tp-gallery-dot.is-active { width:15px;border-radius:3px;background:var(--tp-champagne); }
.tp-gallery-arrow { position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:29px;height:29px;display:flex;align-items:center;justify-content:center;background:#141117a8;border:1px solid var(--tp-line);border-radius:50%; }
.tp-gallery-prev { left:12px; }.tp-gallery-next { right:12px; }
.tp-gallery-compact { min-height:0;background:none; }
.tp-gallery-compact .tp-bottle-art { width:min(78%,220px); }
.tp-gallery-compact .tp-gallery-number { top:14px;left:14px; }
.tp-gallery-compact .tp-gallery-dots { bottom:10px; }
.tp-heart,.tp-open-product { position:absolute;z-index:4;top:13px;width:32px;height:32px;border:1px solid rgba(226,216,197,.16);background:#151219b8;display:flex;align-items:center;justify-content:center;color:#e6dce4; }
.tp-heart { right:13px;border-radius:50%; }.tp-heart.is-favorite,.tp-detail-fav.is-favorite { color:#e0b5c8;border-color:#bb7d9b; }
.tp-open-product { right:51px;border-radius:50%;opacity:0;transition:opacity .2s; }
.tp-product-card:hover .tp-open-product,.tp-open-product:focus-visible { opacity:1; }
.tp-featured-tag { position:absolute;bottom:15px;left:14px;display:flex;align-items:center;gap:5px;color:#d8c28f;font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:.7px;z-index:3; }
.tp-product-copy { padding:16px 17px 15px; }
.tp-product-meta { display:flex;justify-content:space-between;gap:8px;color:#9e95a2;font:8px "SFMono-Regular",Consolas,monospace;letter-spacing:.35px; }
.tp-product-name { display:flex;align-items:center;gap:6px;width:100%;margin:13px 0 5px;padding:0;border:0;background:none;text-align:left;font:22px/1.1 Georgia,"Times New Roman",serif;letter-spacing:-.3px; }
.tp-demo-inline { font:6px "SFMono-Regular",Consolas,monospace;letter-spacing:.8px;color:#bda979;border:1px solid #6e5d3a;padding:3px 4px; }
.tp-notes { margin:0;color:#918995;font-size:10px;line-height:1.65;min-height:17px; }
.tp-product-bottom { display:flex;align-items:center;justify-content:space-between;margin-top:17px;padding-top:14px;border-top:1px solid rgba(226,216,197,.09); }
.tp-product-bottom strong { font:15px "SFMono-Regular",Consolas,monospace;color:#eee5d7; }
.tp-product-bottom small,.tp-cart-price small { display:block;margin-top:5px;color:#8d8490;font:11px "SFMono-Regular",Consolas,monospace;letter-spacing:.55px; }
.tp-add-small { width:33px;height:33px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid rgba(217,196,149,.5);color:var(--tp-champagne); }
.tp-add-small:hover,.tp-add-small.is-added { background:var(--tp-champagne);color:#18151a; }
.tp-stock { margin-top:12px;color:#aaa0aa;font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:.35px; }
.tp-stock.is-out { color:#c2858c; }
.tp-catalog-page { padding-top:1px; }
.tp-catalog-tools { display:flex;align-items:center;gap:10px;margin:0 0 19px; }
.tp-search { height:42px;display:flex;align-items:center;gap:10px;flex:1;max-width:440px;border:1px solid rgba(226,216,197,.18);padding:0 12px;color:#988e9d; }
.tp-search input { width:100%;border:0;outline:none;background:none;color:var(--tp-paper);font-size:11px; }
.tp-search input::placeholder { color:#817985; }.tp-search kbd { white-space:nowrap;color:#827b86;font:8px "SFMono-Regular",Consolas,monospace; }
.tp-filter-chip, .tp-sort { min-height:38px !important; display:inline-flex !important; align-items:center; gap:8px; padding:0 14px; border:1px solid rgba(226,216,197,.17); background:#111015; color:#c9c0cb; font-size:12px !important; }
.tp-filter-chip span { color:var(--tp-champagne);font:9px "SFMono-Regular",Consolas,monospace; }
.tp-filter-chip.is-selected { color:#e2c7dc;border-color:#a87593; }
.tp-sort { position:relative; padding: 0 10px; }.tp-sort select { appearance:none;max-width:160px;border:0;background:none;outline:none;color:inherit;font-size:12px !important; padding: 0 5px; }.tp-sort option { background:#17151c; }
.tp-family-list { display:flex;gap:8px;overflow:auto;padding:2px 0 14px;scrollbar-width:thin;scrollbar-color:#514758 transparent; }
.tp-family-list button { flex:0 0 auto;padding:9px 12px;border:1px solid rgba(226,216,197,.12);background:transparent;color:#a9a0ab;font-size:9px; }
.tp-family-list button.is-active { border-color:#b99b69;background:#d9c495;color:#17141a; }
.tp-results-line { display:flex;justify-content:space-between;padding:15px 0;color:#8f8693;font:8px "SFMono-Regular",Consolas,monospace;letter-spacing:1px; }
.tp-empty-state { display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:270px;border:1px solid var(--tp-line);color:var(--tp-violet-bright);text-align:center; }
.tp-empty-state h3 { margin:17px 0 4px;font:25px Georgia,serif;color:var(--tp-paper); }.tp-empty-state p { color:var(--tp-muted);font-size:12px; }.tp-empty-state button { display:flex;align-items:center;gap:9px;margin-top:12px;padding:10px;background:none;border:1px solid var(--tp-line);font-size:10px; }
.tp-discovery { display:grid;grid-template-columns:1fr 1fr;min-height:515px;border-top:1px solid var(--tp-line);border-bottom:1px solid var(--tp-line);background:#0d0c10; padding-top: 75px; }
.tp-discovery-visual { min-height:480px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 52% 55%,rgba(133,103,147,.17),transparent 48%); }
.tp-discovery-halo { width:330px;aspect-ratio:1;border:1px solid rgba(217,196,149,.16);border-radius:50%;position:absolute;box-shadow:0 0 0 35px rgba(217,196,149,.015),0 0 0 75px rgba(217,196,149,.012); }
.tp-discovery-bottle { width:250px;position:relative;z-index:2;filter:drop-shadow(0 18px 22px #0008); }
.tp-discovery-number { position:absolute;top:50px;left:14%;font:10px "SFMono-Regular",Consolas,monospace;color:var(--tp-champagne); }
.tp-note-orbit { position:absolute;z-index:2;border:1px solid rgba(217,196,149,.4);padding:8px 12px;background:#0d0c10;color:#d8c495;font:12px "SFMono-Regular",Consolas,monospace;letter-spacing:1px; }
.orbit-a { top:26%;left:19%; }.orbit-b { top:43%;right:15%; }.orbit-c { bottom:24%;left:23%; }
.tp-discovery-copy { align-self:center;padding:60px 12% 60px 8%; }
.tp-discovery h2 { margin-bottom:23px;font-size:clamp(39px,4.5vw,59px); }
.tp-discovery-copy > p { max-width:400px;color:#a49ca8;font-size:16px;line-height:1.9;margin-bottom:28px; }
.tp-discovery-foot { display:block;margin-top:43px;color:#776f7b;font:12px "SFMono-Regular",Consolas,monospace;letter-spacing:1px; }
.tp-quote-band { min-height:360px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border-bottom:1px solid var(--tp-line);background:radial-gradient(ellipse at 50% 40%,rgba(82,60,105,.19),transparent 53%); }
.tp-quote-mark { color:var(--tp-champagne);font:76px/.7 Georgia,serif;opacity:.7; }
.tp-quote-band p { margin:10px 0 22px;font:clamp(30px,4vw,49px)/1.17 Georgia,serif;letter-spacing:-1.3px; }
.tp-quote-caption { color:#918793;font:13px "SFMono-Regular",Consolas,monospace;letter-spacing:1.6px; }.tp-quote-caption span { color:var(--tp-champagne);padding:0 6px; }
.tp-family-preview { width:92%;max-width:1640px;margin:0 auto;padding:92px 0 100px; border-bottom: 1px solid rgba(216,189,130,.15); padding-bottom: 75px; }
.tp-family-preview h2 { font-size:clamp(40px,5vw,61px); }.tp-family-preview-head { margin-bottom:32px; }
.tp-family-tiles { display:grid;grid-template-columns:repeat(6,1fr);border:1px solid var(--tp-line); }
.tp-family-tile { min-height:168px;position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;padding:18px;border:0;border-right:1px solid var(--tp-line);background:radial-gradient(ellipse at 75% 25%,rgba(166,126,202,.14),transparent 48%);text-align:left;overflow:hidden; }
.tp-family-tile:last-child { border-right:0; }.tp-family-tile::before { content:"";position:absolute;width:110px;height:110px;border:1px solid rgba(217,196,149,.13);border-radius:50%;right:-35px;top:-32px;box-shadow:0 0 0 18px rgba(217,196,149,.02),0 0 0 37px rgba(217,196,149,.016);transition:transform .35s ease; }.tp-family-tile:hover::before { transform:scale(1.25); }
.tp-family-tile > span { position:absolute;top:15px;left:17px;color:#8f8792;font:8px "SFMono-Regular",Consolas,monospace; }.tp-family-tile strong { font:20px Georgia,serif; }.tp-family-tile svg { position:absolute;bottom:19px;right:17px;color:var(--tp-champagne); }
.family-1,.family-3 { background-color:#100f13; }.family-2,.family-4 { background-image:radial-gradient(ellipse at 75% 25%,rgba(111,144,148,.12),transparent 48%); }.family-5 { background-image:radial-gradient(ellipse at 75% 25%,rgba(196,129,123,.13),transparent 48%); }
.tp-detail-page { width:88%;max-width:1420px;margin:0 auto;padding:30px 0 100px; }
.tp-breadcrumb { display:flex;align-items:center;gap:10px;color:#827a87;font:13px "SFMono-Regular",Consolas,monospace; }.tp-breadcrumb button { background:none;border:0;color:#a59ba8;padding:0; }.tp-breadcrumb span:last-child { color:#d8cfd9; }
.tp-detail-layout { display:grid;grid-template-columns:minmax(0,1.12fr) minmax(340px,.88fr);gap:8%;align-items:center;margin-top:36px; }
.tp-detail-gallery { min-width:0; }.tp-detail-gallery .tp-gallery { height:550px;border:1px solid rgba(226,216,197,.12);background:radial-gradient(ellipse at 50% 55%,rgba(110,79,135,.2),transparent 65%),#111015; }
.tp-detail-gallery .tp-bottle-art { width:min(70%,390px); }.tp-gallery-labels { display:flex;gap:25px;padding:15px 5px 0; }.tp-gallery-labels button { display:flex;align-items:center;gap:7px;padding:0;background:none;border:0;color:#918993;font-size:14px; }.tp-gallery-labels button span { color:#82778b;font:8px "SFMono-Regular",Consolas,monospace; }.tp-gallery-labels button.is-active { color:var(--tp-champagne); }.tp-swipe-hint { display:block;margin-top:20px;color:#756e7a;text-align:center;font:11px "SFMono-Regular",Consolas,monospace;letter-spacing:1.2px; }
.tp-detail-info { padding:23px 0; }.tp-detail-info h1 { font-size:clamp(46px,5.3vw,72px);letter-spacing:-2.7px;line-height:.95;margin:23px 0 22px; }.tp-detail-info h1 em { display:block;margin-top:7px;font-size:.23em;letter-spacing:2px;font-style:normal;font-family:"SFMono-Regular",Consolas,monospace; }
.tp-detail-rule { width:100%;height:1px;background:var(--tp-line); }.tp-detail-desc { color:#b2aab5;font-size:16px;line-height:1.9;max-width:470px;margin:23px 0 20px; }
.tp-detail-tags { display:flex;flex-wrap:wrap;gap:7px; }.tp-detail-tags span { padding:8px 10px;border:1px solid rgba(217,196,149,.23);color:#d8c59b;font-size:13px; }
.tp-detail-specs { display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:22px 0;border-bottom:1px solid var(--tp-line);margin-top:24px; }.tp-detail-specs div { display:flex;flex-direction:column;gap:8px; }.tp-detail-specs span { color:#817987;font:13px "SFMono-Regular",Consolas,monospace;letter-spacing:.6px; }.tp-detail-specs strong { color:#e2d9e4;font:15px Georgia,serif; }
.tp-demo-flag { display:inline-flex;padding:3px 5px;border:1px solid rgba(217,196,149,.36);color:#d8c495;font:10px "SFMono-Regular",Consolas,monospace;letter-spacing:.65px;vertical-align:middle; }
.tp-detail-price { display:flex;align-items:center;gap:10px;margin-top:24px;font:22px "SFMono-Regular",Consolas,monospace; }.tp-detail-stock { display:flex;align-items:center;gap:7px;margin:14px 0;color:#a39aa5;font:12px "SFMono-Regular",Consolas,monospace; }.tp-stock-dot { width:5px;height:5px;border-radius:50%;background:#a8c58b; }.tp-stock-dot.out { background:#c4848c; }
.tp-detail-actions { display:flex;gap:9px;margin-top:19px; }.tp-detail-actions .tp-button-primary { flex:1; }.tp-detail-fav { width:48px;display:flex;align-items:center;justify-content:center;border:1px solid var(--tp-line);background:transparent; }
.tp-demo-disclaimer { display:flex;align-items:center;gap:7px;color:#827a86;font-size:14px;margin:14px 0 29px; }.tp-demo-disclaimer svg { color:var(--tp-champagne); }.tp-next-product { display:flex;align-items:center;gap:10px;padding:13px 0;background:none;border:0;border-top:1px solid var(--tp-line);width:100%;color:#c1b5c3;font:8px "SFMono-Regular",Consolas,monospace;letter-spacing:1px; }
.tp-page-shell { width:88%;max-width:1420px;margin:0 auto;padding:84px 0 106px; }.tp-page-shell > .tp-eyebrow { margin-bottom:20px; }.tp-page-shell h1 { font-size:clamp(55px,7vw,90px);margin:0 0 48px; }
.tp-cart-page h1 { margin-bottom:42px; }.tp-cart-layout { display:grid;grid-template-columns:minmax(0,1.55fr) minmax(270px,.65fr);gap:7%;align-items:start; }.tp-cart-items { border-top:1px solid var(--tp-line); }.tp-cart-row { display:grid;grid-template-columns:92px minmax(150px,1fr) 108px 125px 26px;align-items:center;gap:16px;min-height:132px;border-bottom:1px solid var(--tp-line); }
.tp-cart-thumb { height:102px;background:radial-gradient(ellipse at 50% 60%,rgba(160,120,189,.18),transparent 65%),#111015;overflow:hidden;display:flex;align-items:center;justify-content:center; }.tp-cart-thumb svg { width:86px;height:auto; }.tp-cart-product > span { display:block;color:#918994;font:14px "SFMono-Regular",Consolas,monospace;letter-spacing:.7px; }.tp-cart-product > button { display:block;margin:9px 0 6px;padding:0;border:0;background:none;text-align:left;font:21px Georgia,serif; }.tp-cart-product small { color:#948b97;font-size:13px; }
.tp-quantity { height:32px;display:flex;align-items:center;justify-content:space-between;border:1px solid var(--tp-line); }.tp-quantity button { width:31px;height:30px;display:flex;align-items:center;justify-content:center;background:none;border:0;color:#c7bdc7; }.tp-quantity span { font:14px "SFMono-Regular",Consolas,monospace; }.tp-cart-price { text-align:right;font:16px "SFMono-Regular",Consolas,monospace;white-space:nowrap; }.tp-remove-item { background:none;border:0;color:#817985;padding:4px; }.tp-remove-item:hover { color:#d4909a; }
.tp-cart-controls { display:flex;align-items:center;justify-content:space-between;padding:17px 0; }.tp-clear-cart { display:flex;align-items:center;gap:6px;border:0;background:none;color:#a69098;font-size:12px; }
.tp-cart-summary,.tp-checkout-aside { padding:23px 22px;background:#151319;border:1px solid rgba(217,196,149,.17); }.tp-summary-kicker { display:block;color:var(--tp-champagne);font:20px "SFMono-Regular",Consolas,monospace;letter-spacing:1.1px;padding-bottom:18px;border-bottom:1px solid var(--tp-line); }
.tp-summary-line,.tp-summary-total { display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:19px;color:#c1b8c3;font-size:20px; }.tp-summary-line strong,.tp-summary-total strong { color:#f0e9dd;font:19px "SFMono-Regular",Consolas,monospace;white-space:nowrap; }.tp-summary-shipping { margin-top:11px;color:#9c929e;font-size:13px; }.tp-summary-total { margin-top:20px;padding-top:16px;border-top:1px solid var(--tp-line);font-weight:600; }.tp-checkout-button { width:100%;margin-top:21px;justify-content:space-between; }.tp-cart-summary > p { display:flex;align-items:center;gap:7px;color:#8c8390;font-size:14px;line-height:1.5; }.tp-cart-summary > p svg { flex-shrink:0;color:var(--tp-champagne); }
.tp-summary-delivery { display:flex;gap:9px;margin-top:20px;padding-top:17px;border-top:1px solid var(--tp-line);color:#9a919d;font-size:13px;line-height:1.7; }.tp-summary-delivery svg { flex-shrink:0;color:var(--tp-champagne);margin-top:2px; }
.tp-cart-empty { min-height:370px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border-bottom:1px solid var(--tp-line);color:var(--tp-champagne); }.tp-cart-empty h2 { margin:17px 0 8px;color:var(--tp-paper);font:29px Georgia,serif; }.tp-cart-empty p { max-width:300px;color:#9a929f;font-size:11px;line-height:1.8;margin:0 0 18px; }
.tp-confirm-backdrop { position:fixed;z-index:100;inset:0;background:rgba(3,3,5,.78);display:flex;align-items:center;justify-content:center;padding:20px; }.tp-confirm-dialog { position:relative;width:min(440px,100%);padding:37px;background:#18161c;border:1px solid rgba(217,196,149,.3);text-align:center;box-shadow:0 22px 70px #0009; }.tp-dialog-close { position:absolute;right:14px;top:14px;background:none;border:0;color:#aaa0ad; }.tp-dialog-icon { width:44px;height:44px;display:grid;place-items:center;margin:0 auto 17px;border:1px solid rgba(217,196,149,.4);border-radius:50%;color:var(--tp-champagne); }.tp-confirm-dialog h2 { margin:0;font:30px Georgia,serif; }.tp-confirm-dialog p { margin:12px 0 22px;color:#a59ca8;font-size:11px;line-height:1.7; }.tp-confirm-dialog > div:last-child { display:flex;justify-content:center;gap:19px; }
.tp-checkout-page h1 { margin-bottom:32px; }.tp-checkout-banner { display:flex;align-items:center;gap:13px;padding:17px 19px;border:1px solid rgba(217,196,149,.3);background:#17151b;color:var(--tp-champagne); }.tp-checkout-banner > div { display:flex;flex-direction:column;gap:5px;flex:1; }.tp-checkout-banner strong { color:#e6dcca;font-size:11px; }.tp-checkout-banner span { color:#a79eaa;font-size:9px;line-height:1.5; }.tp-checkout-banner .tp-demo-flag { flex:0 0 auto; }
.tp-checkout-layout { display:grid;grid-template-columns:minmax(0,1.5fr) minmax(270px,.65fr);gap:6%;align-items:start;margin-top:37px; }.tp-stepper { display:flex;align-items:center;gap:15px;margin-bottom:29px; }.tp-stepper > div { display:flex;align-items:center;gap:8px;color:#817985; }.tp-stepper > div.is-current { color:var(--tp-champagne); }.tp-stepper > div span { font:8px "SFMono-Regular",Consolas,monospace; }.tp-stepper > div b { font-size:9px;font-weight:400; }.tp-stepper > i { height:1px;flex:1;background:var(--tp-line); }
.tp-checkout-panel { padding:25px;background:#121116;border:1px solid var(--tp-line); }.tp-checkout-panel > h2 { margin:23px 0 9px;font:29px Georgia,serif; }.tp-checkout-panel > p { max-width:500px;color:#a59ca8;font-size:11px;line-height:1.8; }.tp-checkout-recap { padding:16px 0;margin:20px 0;border-top:1px solid var(--tp-line);border-bottom:1px solid var(--tp-line); }.tp-checkout-recap > div { display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;color:#c9c0ca;font-size:10px; }.tp-checkout-recap strong { font:10px "SFMono-Regular",Consolas,monospace;white-space:nowrap; }.tp-checkout-panel > .tp-button-primary { width:100%;justify-content:space-between; }.tp-inline-feedback { display:flex;align-items:center;gap:8px;margin-top:15px;color:#b7c89e;font-size:10px; }.tp-checkout-aside p { color:#a49ba7;font-size:10px;line-height:1.8;margin-top:18px; }.tp-payment-visual { display:flex;align-items:center;gap:8px;padding:14px 0 0;border-top:1px solid var(--tp-line);color:#c4bac6;font-size:9px; }.tp-payment-visual .tp-demo-flag { margin-left:auto; }.tp-back-cart { margin-top:27px; }
.tp-brand-page > h1 { margin-bottom:45px; }.tp-brand-story { display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:10%; }.tp-brand-abstract { min-height:390px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:radial-gradient(ellipse at center,rgba(106,76,135,.2),transparent 55%);border:1px solid var(--tp-line); }.tp-brand-abstract > span { position:relative;z-index:2;color:#d9c495;font:112px Georgia,serif;letter-spacing:-14px;padding-right:14px; }.tp-brand-ring { position:absolute;border:1px solid rgba(217,196,149,.23);border-radius:50%;width:200px;height:200px; }.ring-2 { width:280px;height:280px;border-color:rgba(176,142,198,.2); }.ring-3 { width:360px;height:360px;border-color:rgba(217,196,149,.12); }.tp-brand-abstract small { position:absolute;bottom:18px;left:18px;color:#8d8391;font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:1.1px; }.tp-brand-text > span { color:var(--tp-champagne);font:8px "SFMono-Regular",Consolas,monospace;letter-spacing:1.3px; }.tp-brand-text h2 { margin:18px 0;font:40px/1.05 Georgia,serif; }.tp-brand-text p { color:#a69eaa;font-size:12px;line-height:1.9; }.tp-brand-values { display:grid;grid-template-columns:repeat(3,1fr);margin-top:50px;border-top:1px solid var(--tp-line);border-bottom:1px solid var(--tp-line); }.tp-brand-values > div { padding:23px 17px;border-right:1px solid var(--tp-line); }.tp-brand-values > div:first-child { padding-left:0; }.tp-brand-values > div:last-child { border:0; }.tp-brand-values span { display:block;color:var(--tp-champagne);font:8px "SFMono-Regular",Consolas,monospace; }.tp-brand-values strong { display:block;margin-top:13px;font:20px Georgia,serif; }.tp-brand-values p { color:#8f8792;font-size:10px; }.tp-brand-note { display:flex;align-items:center;gap:10px;margin-top:25px;color:#9e95a0;font-size:9px; }.tp-brand-note svg { color:var(--tp-champagne); }
.tp-info-page h1 { margin-bottom:17px; }.tp-info-intro { max-width:540px;color:#a69daa;font-size:12px;line-height:1.8;margin-bottom:34px; }.tp-info-cards { display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:30px;border:1px solid var(--tp-line); }.tp-info-card { min-height:322px;padding:21px;border-right:1px solid var(--tp-line);background:radial-gradient(ellipse at 70% 20%,rgba(161,121,195,.1),transparent 55%); }.tp-info-card:last-child { border:0; }.tp-info-index { color:#918894;font:12px "SFMono-Regular",Consolas,monospace;letter-spacing:1px; }.tp-info-icon { width:42px;height:42px;margin:31px 0 18px;border:1px solid rgba(217,196,149,.36);display:grid;place-items:center;color:var(--tp-champagne); }.tp-info-card h2 { margin:0 0 13px;font:28px/1.05 Georgia,serif; }.tp-info-card p { min-height:68px;color:#a49ba7;font-size:14px;line-height:1.8; }.tp-info-card .tp-demo-flag { margin-top:10px; }
.tp-contact-page > h1 { margin-bottom:49px; }.tp-contact-card { display:grid;grid-template-columns:.9fr 1.1fr;border:1px solid var(--tp-line);min-height:365px; }.tp-contact-card-art { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;color:var(--tp-champagne);background:radial-gradient(ellipse at center,rgba(112,79,138,.2),transparent 63%),#111015;border-right:1px solid var(--tp-line); }.tp-contact-card-art span { color:#a89ead;text-align:center;font:8px/1.8 "SFMono-Regular",Consolas,monospace;letter-spacing:1.5px; }.tp-contact-copy { align-self:center;padding:42px 10%; }.tp-contact-copy h2 { margin:22px 0 12px;font:39px/1.05 Georgia,serif; }.tp-contact-copy p { max-width:420px;color:#a59ca8;font-size:11px;line-height:1.85;margin-bottom:22px; }.tp-contact-copy .tp-button-outline { gap:9px; }.tp-contact-micro { display:block;margin-top:14px;color:#7e7683;font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:.8px; }.tp-contact-bottom { display:flex;justify-content:space-between;margin-top:22px;color:#827987;font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:1px; }
.tp-footer { border-top:1px solid var(--tp-line);background:#0d0c10; }.tp-footer-main { width:92%;max-width:1640px;margin:0 auto;padding:47px 0 43px;display:grid;grid-template-columns:1.1fr 1fr .8fr 1.1fr;gap:35px;align-items:start; }.tp-footer-main > p { margin:6px 0;color:#99919d;font:16px/1.5 Georgia,serif; }.tp-footer-links { display:flex;flex-direction:column;align-items:flex-start;gap:9px; }.tp-footer-links > span,.tp-footer-news > span { color:var(--tp-champagne);font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:1.2px;margin-bottom:4px; }.tp-footer-links button,.tp-footer-bottom button { padding:0;background:none;border:0;color:#a8a0aa;text-align:left;font-size:9px; }.tp-footer-news { display:flex;flex-direction:column;align-items:flex-start;gap:11px; }.tp-footer-news strong { font:19px Georgia,serif; }.tp-footer-news button { display:flex;align-items:center;gap:8px;padding:9px 0;border:0;border-bottom:1px solid rgba(217,196,149,.3);background:none;color:#d5c6a1;font-size:9px; }.tp-footer-bottom { min-height:43px;padding:0 4%;display:flex;justify-content:space-between;align-items:center;gap:14px;border-top:1px solid rgba(226,216,197,.09);color:#79717d;font:7px "SFMono-Regular",Consolas,monospace;letter-spacing:.5px; }.tp-footer-bottom button { color:#b5aeb8;font:inherit;letter-spacing:inherit;white-space:nowrap; }
.tp-toast { position:fixed;z-index:120;right:22px;bottom:22px;max-width:min(430px,calc(100vw - 32px));display:flex;align-items:center;gap:10px;padding:14px 15px;background:#e4d4ae;color:#1d1920;box-shadow:0 10px 35px #0008;font-size:10px;animation:tp-toast-in .22s ease-out; }.tp-toast > svg { flex-shrink:0; }.tp-toast button { margin-left:5px;padding:2px;border:0;background:none;color:#332c31; }
@keyframes tp-toast-in { from { opacity:0;transform:translateY(8px); } to { opacity:1;transform:translateY(0); } }
@media (min-width:1700px) { .tp-header { padding-left:max(4%,calc((100% - 1640px)/2));padding-right:max(4%,calc((100% - 1640px)/2)); } }
@media (max-width:1050px) {
 .tp-header { padding:0 3%; }.tp-nav { gap:15px;margin-right:19px; }.tp-nav button { font-size:10px; }.tp-brand-wordmark { font-size:17px; }.tp-product-grid { gap:12px; }.tp-product-copy { padding:14px 12px; }.tp-product-name { font-size:19px; }.tp-cart-row { grid-template-columns:74px minmax(120px,1fr) 92px 105px 22px;gap:10px; }.tp-cart-thumb { height:88px; }
}
@media (max-width:760px) {
 .tp-demo-ribbon { min-height:30px;padding:0 14px;font-size:7px; }.tp-demo-ribbon > span:nth-child(2) { display:none; }.tp-demo-ribbon button { margin-left:auto; }
 .tp-header { height:66px;padding:0 17px; }.tp-brand-symbol { width:25px;height:25px; }.tp-brand-symbol i { height:11px; }.tp-brand-symbol i:nth-child(2){height:15px}.tp-brand-wordmark { font-size:17px; }.tp-brand-wordmark small { font-size:6px; }.tp-header-actions { gap:11px; }.tp-header-fav { gap:5px; }.tp-cart-button { width:39px;height:37px;padding:0;justify-content:center;position:relative; }.tp-cart-button span { display:none; }.tp-cart-button b { position:absolute;right:-7px;top:-7px;min-width:17px;height:17px;font-size:7px; }.tp-mobile-toggle { display:flex;align-items:center;justify-content:center; }
 .tp-nav { display:none;position:absolute;top:65px;left:0;right:0;margin:0;padding:13px 18px 20px;background:#111015;border-bottom:1px solid var(--tp-line);grid-template-columns:repeat(2,1fr);gap:0 18px; }.tp-nav.is-open { display:grid; }.tp-nav button { text-align:left;padding:13px 3px;border-bottom:1px solid rgba(226,216,197,.08);font-size:11px; }.tp-nav button.is-current::after { left:3px;right:auto;width:20px;bottom:5px; }
 .tp-hero { height:auto;min-height:0;padding:73px 7% 55px;grid-template-columns:1fr; }.tp-hero::before { background:linear-gradient(180deg,#09090c 0%,rgba(9,9,12,.95) 48%,rgba(9,9,12,.42) 100%); }.tp-hero-copy { padding:0; }.tp-eyebrow { font-size:7px;letter-spacing:1.2px; }.tp-hero h1 { margin:23px 0 14px;font-size:clamp(56px,16vw,80px);letter-spacing:-3.5px; }.tp-hero-copy > p { max-width:360px;font-size:12px; }.tp-hero-actions { margin-top:23px;gap:20px; }.tp-button-primary,.tp-button-outline { min-height:43px;padding:0 13px;font-size:10px;gap:9px; }.tp-button-quiet { font-size:10px; }.tp-hero-proof { margin-top:35px;flex-wrap:wrap;font-size:7px; }.tp-hero-art { height:320px;margin-top:-6px; }.tp-hero-disc { width:min(77vw,340px); }.tp-hero-orbit { width:min(88vw,390px); }.tp-orbit-two { width:min(98vw,440px); }.tp-hero-bottle { width:min(74vw,300px); }.tp-hero-art-label { left:0;top:18%;font-size:7px; }.tp-float-top { right:0;top:17%;font-size:7px; }.tp-float-bottom { bottom:12%;right:0;font-size:7px; }.tp-hero-index { bottom:9%;left:0; }.tp-hero-foot { left:7%;right:7%;bottom:15px;font-size:6px; }.tp-marquee { height:44px; }.tp-marquee-track { min-width:max-content;gap:24px;font-size:7px; }
 .tp-catalog-section,.tp-family-preview { width:88%;padding:68px 0 73px; }.tp-section-heading,.tp-family-preview-head { align-items:start;gap:15px;margin-bottom:27px; }.tp-section-heading h2,.tp-discovery h2,.tp-family-preview h2 { font-size:43px;letter-spacing:-1.6px; }.tp-section-heading .tp-text-link { font-size:9px;margin-top:10px;white-space:nowrap; }.tp-section-note { display:none; }.tp-product-grid { grid-template-columns:repeat(2,minmax(0,1fr));gap:11px; }.tp-card-visual { height:clamp(170px,52vw,250px); }.tp-gallery-compact .tp-bottle-art { width:min(92%,190px); }.tp-product-copy { padding:12px 10px; }.tp-product-meta { font-size:12px; }.tp-product-name { font-size:17px;margin-top:10px; }.tp-notes { font-size:9px;min-height:29px; }.tp-product-bottom { margin-top:11px;padding-top:10px; }.tp-product-bottom strong { font-size:11px; }.tp-product-bottom small { font-size:6px; }.tp-add-small { width:29px;height:29px; }.tp-stock { font-size:6px; }.tp-featured-tag { font-size:6px; }.tp-heart { width:28px;height:28px;right:8px;top:9px; }.tp-open-product { display:none; }
 .tp-catalog-tools { display:grid;grid-template-columns:1fr auto;gap:8px; }.tp-search { grid-column:1/-1;max-width:none; }.tp-filter-chip,.tp-sort { min-height:38px;padding:0 9px;font-size:9px; }.tp-sort select { max-width:135px;font-size:9px; }.tp-family-list { gap:6px; }.tp-family-list button { padding:8px 10px;font-size:8px; }.tp-results-line { font-size:6px; }.tp-discovery { grid-template-columns:1fr; }.tp-discovery-visual { min-height:350px; }.tp-discovery-halo { width:235px; }.tp-discovery-bottle { width:190px; }.tp-discovery-number { top:28px;left:8%; }.orbit-a { left:13%; }.orbit-b { right:9%; }.orbit-c { left:15%; }.tp-discovery-copy { padding:28px 7% 54px; }.tp-discovery h2 { font-size:40px; }.tp-discovery-copy > p { font-size:11px; }.tp-discovery-foot { margin-top:27px; }.tp-quote-band { min-height:270px;padding:25px 15px; }.tp-quote-band p { font-size:31px; }.tp-quote-caption { font-size:6px;letter-spacing:1px; }.tp-family-preview { padding-bottom:63px; }.tp-family-tiles { grid-template-columns:repeat(2,1fr); }.tp-family-tile { min-height:130px;padding:13px;border-bottom:1px solid var(--tp-line); }.tp-family-tile:nth-child(2n) { border-right:0; }.tp-family-tile:nth-last-child(-n+2) { border-bottom:0; }.tp-family-tile strong { font-size:18px; }
 .tp-detail-page { width:88%;padding:21px 0 68px; }.tp-detail-layout { grid-template-columns:1fr;gap:28px;margin-top:23px; }.tp-detail-gallery .tp-gallery { height:min(98vw,440px);min-height:330px; }.tp-detail-gallery .tp-bottle-art { width:min(78%,320px); }.tp-gallery-labels { justify-content:space-between;gap:8px; }.tp-gallery-labels button { font-size:8px;gap:4px; }.tp-swipe-hint { font-size:6px; }.tp-detail-info { padding:0; }.tp-detail-info h1 { font-size:56px; }.tp-detail-desc { font-size:12px; }.tp-page-shell { width:88%;padding:63px 0 73px; }.tp-page-shell h1 { font-size:58px;margin-bottom:35px; }.tp-cart-layout,.tp-checkout-layout { grid-template-columns:1fr;gap:25px; }.tp-cart-row { grid-template-columns:57px minmax(80px,1fr) 78px 85px 18px;gap:7px;min-height:104px; }.tp-cart-thumb { height:72px; }.tp-cart-thumb svg { width:64px; }.tp-cart-product > button { font-size:14px;margin:6px 0 4px; }.tp-cart-product > span,.tp-cart-product small { font-size:7px; }.tp-cart-product .tp-demo-flag { font-size:5px; }.tp-quantity { height:28px; }.tp-quantity button { width:23px;height:26px;padding:0; }.tp-quantity button svg { width:12px; }.tp-quantity span { font-size:9px; }.tp-cart-price { font-size:9px; }.tp-cart-price small { font-size:5px; }.tp-remove-item svg { width:14px; }.tp-cart-summary { padding:20px; }.tp-cart-controls { flex-wrap:wrap;gap:10px; }.tp-confirm-dialog { padding:30px 20px; }.tp-confirm-dialog > div:last-child { flex-direction:column;gap:5px; }.tp-confirm-dialog > div:last-child button { width:100%; }
 .tp-checkout-banner { align-items:flex-start;flex-wrap:wrap;padding:14px; }.tp-checkout-banner > div { min-width:calc(100% - 48px); }.tp-checkout-banner .tp-demo-flag { margin-left:31px; }.tp-stepper { gap:7px; }.tp-stepper > div { gap:5px; }.tp-stepper > div b { font-size:7px; }.tp-stepper > i { min-width:10px; }.tp-checkout-panel { padding:18px; }.tp-checkout-panel > h2 { font-size:25px; }.tp-checkout-recap > div { font-size:8px; }.tp-checkout-recap .tp-demo-flag { font-size:5px; }
 .tp-brand-story { grid-template-columns:1fr;gap:30px; }.tp-brand-abstract { min-height:300px; }.tp-brand-abstract > span { font-size:88px; }.tp-brand-ring { width:150px;height:150px; }.ring-2 { width:220px;height:220px; }.ring-3 { width:290px;height:290px; }.tp-brand-text h2 { font-size:34px; }.tp-brand-text p { font-size:11px; }.tp-brand-values { margin-top:32px; }.tp-brand-values > div { padding:16px 10px; }.tp-brand-values > div:first-child { padding-left:0; }.tp-brand-values strong { font-size:16px; }.tp-brand-values p { font-size:8px;line-height:1.6; }
 .tp-info-cards { grid-template-columns:1fr; }.tp-info-card { min-height:0;padding:18px;border-right:0;border-bottom:1px solid var(--tp-line); }.tp-info-card:last-child { border-bottom:0; }.tp-info-icon { margin:19px 0 13px; }.tp-info-card h2 { font-size:23px; }.tp-info-card p { min-height:0;margin-bottom:9px; }.tp-contact-card { grid-template-columns:1fr; }.tp-contact-card-art { min-height:190px;border-right:0;border-bottom:1px solid var(--tp-line); }.tp-contact-copy { padding:30px 8%; }.tp-contact-copy h2 { font-size:34px; }.tp-contact-bottom { gap:14px;font-size:6px;line-height:1.5; }.tp-footer-main { width:88%;grid-template-columns:1fr 1fr;gap:28px 18px;padding:35px 0; }.tp-footer-main > p { font-size:13px; }.tp-footer-news { grid-column:1/-1;padding-top:16px;border-top:1px solid var(--tp-line); }.tp-footer-bottom { padding:12px 6%;min-height:0;flex-wrap:wrap;font-size:6px;line-height:1.6; }.tp-footer-bottom > span:nth-child(2) { display:none; }
}
@media (max-width:380px) {
 .tp-brand-wordmark { font-size:15px; }.tp-header-actions { gap:7px; }.tp-header-fav svg { width:15px; }.tp-cart-row { grid-template-columns:48px minmax(65px,1fr) 65px 70px 16px;gap:5px; }.tp-cart-thumb { height:63px; }.tp-cart-thumb svg { width:53px; }.tp-cart-product > button { font-size:12px; }.tp-cart-product > span { font-size:6px; }.tp-cart-price { font-size:8px; }.tp-quantity button { width:19px; }.tp-family-preview-head .tp-text-link { font-size:8px;gap:5px; }
}
@media (prefers-reduced-motion:reduce) { .tp-root *, .tp-root *::before, .tp-root *::after { scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important; } }

/* Reference-led storefront refresh */
.tp-root {
  --tp-ink:#08080b;
  --tp-surface:#111014;
  --tp-raised:#19171d;
  --tp-line:rgba(224,211,188,.17);
  --tp-paper:#f3eee8;
  --tp-muted:#aaa2ad;
  --tp-champagne:#d8bd82;
  --tp-violet:#9b36e9;
  --tp-violet-bright:#eb70f3;
  background:var(--tp-ink);
}
.tp-header {
  height:78px;
  padding:0 3.6%;
  display:grid;
  grid-template-columns:minmax(160px,1fr) auto minmax(180px,245px) auto;
  gap:clamp(16px,2.3vw,34px);
  background:rgba(9,8,12,.97);
}
.tp-brand-lockup { gap:12px; }
.tp-brand-symbol {
  width:38px;height:38px;display:grid;place-items:center;
  border:0;transform:none;color:var(--tp-champagne);
}
.tp-brand-symbol svg { filter:drop-shadow(0 0 8px rgba(216,189,130,.22)); }
.tp-brand-wordmark { font-size:22px;letter-spacing:-.35px; }
.tp-brand-wordmark small { color:#a59ba5;letter-spacing:1.15px;font-size:10px; }
.tp-nav { gap:clamp(15px,2.1vw,30px);margin:0; }
.tp-nav button { padding:11px 0;color:#d0c9d0;font-size:14px; }
.tp-nav button.is-current::after {
  height:2px;bottom:0;background:#ee53e8;
  box-shadow:0 0 6px #eb41ee,0 0 14px rgba(223,46,239,.86);
}
.tp-header-search {
  height:39px;display:flex;align-items:center;gap:8px;padding:0 12px;
  border:1px solid rgba(226,216,229,.22);border-radius:22px;
  background:rgba(255,255,255,.045);color:#d7cfd9;
  box-shadow:inset 0 0 14px rgba(255,255,255,.015);
}
.tp-header-search button {
  display:grid;place-items:center;padding:0;border:0;background:none;color:#e7dce8;
}
.tp-header-search input {
  width:100%;min-width:0;border:0;outline:0;background:none;
  color:var(--tp-paper);font-size:14px;
}
.tp-header-search input::placeholder { color:#a49aa7; }
.tp-header-actions { gap:18px; }
.tp-account-button,.tp-cart-button {
  position:relative;display:grid;place-items:center;width:34px;height:38px;
  padding:0;border:0;background:none;color:#eee8ef;
}
.tp-account-button:hover,.tp-cart-button:hover { color:var(--tp-champagne); }
.tp-cart-button b {
  position:absolute;right:-5px;top:-1px;display:grid;place-items:center;
  min-width:19px;height:19px;padding:0 4px;border-radius:50%;
  background:#9228d6;color:#fff;font:9px/1 Inter,ui-sans-serif,system-ui,sans-serif;
  box-shadow:0 0 9px rgba(166,47,234,.46);
}
.tp-mobile-toggle { display:none; }
.tp-hero {
  position:relative;display:flex;align-items:center;
  height:clamp(292px,30vw,370px);min-height:292px;max-height:390px;
  padding:0 7.2%;border-bottom:1px solid var(--tp-line);
  background:#08070b;isolation:isolate;
}
.tp-hero::before {
  content:"";position:absolute;z-index:-2;inset:0 0 0 31%;
  background:url("/__mockup/images/hero-reference-bg.png") center 53%/cover no-repeat;
}
.tp-hero::after {
  content:"";position:absolute;z-index:-1;inset:0;pointer-events:none;
  background:
    linear-gradient(90deg,#08070b 0%,rgba(8,7,11,.96) 25%,rgba(8,7,11,.78) 42%,rgba(8,7,11,.12) 68%,rgba(8,7,11,.03) 100%),
    linear-gradient(0deg,rgba(8,7,11,.34),transparent 30%,transparent 75%,rgba(8,7,11,.12));
}
.tp-hero-copy { width:min(48%,620px);max-width:620px;padding:0 0 0 2.3%; }
.tp-hero .tp-eyebrow { color:#dfc98f;font-size:9px;letter-spacing:1.55px; }
.tp-hero h1 {
  margin:13px 0 10px;font:clamp(38px,4.4vw,64px)/.94 Georgia,"Times New Roman",serif;
  letter-spacing:-2.4px;
}
.tp-hero h1 em { color:#e2c995;font-style:normal;font-weight:400; }
.tp-hero-copy>p { max-width:360px;color:#e1dbe1;font-size:14px;line-height:1.6; }
.tp-hero-actions { margin-top:18px; }
.tp-hero .tp-button-primary {
  min-height:40px;padding:0 18px;border-radius:24px;
  background:linear-gradient(110deg,#e9cc92,#c69752);border-color:#e6c88b;
  color:#171219!important;font-size:14px;font-weight:650;box-shadow:0 4px 18px rgba(218,172,102,.22);
}
.tp-hero .tp-button-primary:hover { box-shadow:0 0 21px rgba(235,194,121,.48); }
.tp-hero-indicators {
  position:absolute;left:3.1%;top:50%;display:flex;flex-direction:column;
  gap:8px;transform:translateY(-50%);z-index:2;
}
.tp-hero-indicators span {
  width:8px;height:8px;border:1px solid rgba(226,203,154,.78);border-radius:50%;
  background:rgba(10,9,13,.35);
}
.tp-hero-indicators span.is-active { background:var(--tp-champagne);box-shadow:0 0 9px rgba(236,197,124,.58); }
.tp-catalog-section { width:94%;max-width:1680px;padding:21px 0 24px; }
.tp-section-heading { align-items:center;margin-bottom:13px; }
.tp-section-heading h2 {
  margin:5px 0 0;font-size:clamp(26px,2.8vw,36px);line-height:1.05;letter-spacing:-.8px;
}
.tp-section-heading h2 em { color:#e1c791;font-style:normal; }
.tp-section-heading .tp-eyebrow { gap:8px;font-size:7px;letter-spacing:1.1px; }
.tp-section-heading .tp-eyebrow-line { width:21px; }
.tp-section-note { max-width:260px;margin:0;text-align:right;font-size:10px; }
.tp-text-link { color:#d7cfd6;font-size:9px; }
.tp-round-arrow {
  width:24px;height:24px;display:grid;place-items:center;border:1px solid rgba(216,189,130,.65);
  border-radius:50%;color:var(--tp-champagne);
}
.tp-product-grid { grid-template-columns:repeat(4,minmax(0,1fr));gap:10px; }
.tp-product-card {
  min-width:0;overflow:hidden;border:1px solid rgba(224,211,188,.18);
  border-radius:14px;background:linear-gradient(155deg,#17151a,#0f0e12 70%);
  box-shadow:0 7px 22px rgba(0,0,0,.16);
}
.tp-product-card:hover { transform:translateY(-2px);border-color:rgba(216,189,130,.52); }
.tp-card-visual { height:clamp(168px,17vw,220px);background:#141217; }
.tp-gallery {
  display:grid;grid-template-columns:minmax(0,1fr) 39px;gap:7px;
  min-height:0;height:100%;padding:8px;background:none;
}
.tp-gallery-main {
  position:relative;min-width:0;min-height:0;display:flex;align-items:center;
  justify-content:center;overflow:hidden;border:1px solid rgba(226,216,197,.1);
  border-radius:10px;background:
    radial-gradient(ellipse at 50% 61%,rgba(143,105,157,.19),transparent 62%),
    linear-gradient(145deg,#201d24,#111014 76%);
}
.tp-gallery-glow { width:86%;height:68%;left:7%;top:16%;filter:blur(17px);opacity:.75; }
.tp-bottle-art {
  width:min(67%,220px);height:auto;max-height:91%;
  filter:drop-shadow(0 13px 14px rgba(0,0,0,.55));
}
.tp-gallery-number { top:9px;left:10px;font-size:7px; }
.tp-gallery-main .tp-art-caption { bottom:9px;font-size:6px; }
.tp-gallery-thumbs { position:relative;z-index:4;display:flex;flex-direction:column;justify-content:center;gap:6px;min-width:0; }
.tp-gallery-thumb {
  width:100%;aspect-ratio:1;min-height:0;display:grid;place-items:center;overflow:hidden;
  padding:2px;border:1px solid rgba(226,216,197,.16);border-radius:7px;
  background:linear-gradient(145deg,#252129,#131116);transition:border-color .18s,transform .18s;
}
.tp-gallery-thumb:hover { transform:scale(1.04);border-color:var(--tp-champagne); }
.tp-thumb-bottle { width:71%;height:auto;max-height:92%; }
.tp-gallery-compact { min-height:0; }
.tp-gallery-compact .tp-gallery-number { top:8px;left:9px; }
.tp-heart {
  top:9px;left:9px;right:auto;width:27px;height:27px;border-radius:50%;
  border-color:rgba(226,216,197,.24);background:#110f14d9;
}
.tp-heart svg { width:14px;height:14px; }
.tp-product-copy { padding:9px 11px 10px; }
.tp-product-name {
  display:block;overflow:hidden;margin:0 0 4px;font-size:16px;line-height:1.15;
  text-overflow:ellipsis;white-space:nowrap;
}
.tp-product-meta { gap:6px;color:#aaa1aa;font-size:12px;letter-spacing:.2px; }
.tp-product-meta span:last-child { overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right; }
.tp-product-bottom { gap:8px;margin-top:9px;padding-top:8px;border-top:1px solid rgba(226,216,197,.1); }
.tp-product-bottom>div { min-width:0; }
.tp-product-bottom strong { color:#e4cc97;font-size:15px;white-space:nowrap; }
.tp-product-bottom small { margin-top:3px;font-size:12px; }
.tp-product-cta {
  min-width:102px;height:32px;display:flex;align-items:center;justify-content:space-between;gap:7px;
  padding:0 5px 0 10px;border:1px solid rgba(216,189,130,.76);border-radius:19px;
  background:rgba(15,13,17,.65);color:#ead8ad;font-size:8px;transition:background .2s,box-shadow .2s;
}
.tp-product-cta:hover,.tp-product-cta.is-added { background:rgba(216,189,130,.13);box-shadow:0 0 11px rgba(216,189,130,.12); }
.tp-product-cta>span { flex:1;text-align:center; }
.tp-product-cta>i {
  width:21px;height:21px;display:grid;place-items:center;border:1px solid rgba(216,189,130,.58);
  border-radius:50%;font-style:normal;
}
.tp-stock { margin-top:6px;font-size:11px; }
.tp-audience-filter {
  display:flex;align-items:center;gap:6px;margin:12px 0 9px;padding:0;
}
.tp-audience-filter>span {
  margin-right:5px;color:#ddd4dc;font-size:9px;font-weight:600;white-space:nowrap;
}
.tp-audience-filter button {
  min-height:27px;padding:0 11px;border:1px solid rgba(226,216,197,.17);
  border-radius:16px;background:#121015;color:#bcb4be;font-size:8px;white-space:nowrap;
}
.tp-audience-filter button.is-active {
  border-color:rgba(235,74,232,.7);background:rgba(138,42,179,.18);color:#f3cbf2;
  box-shadow:0 0 10px rgba(212,50,233,.14);
}
.tp-catalog-tools { display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin:0 0 9px; }
.tp-filter-select { position:relative;min-height:38px;display:flex;align-items:center;gap:8px;padding:0 14px 0 12px; border:1px solid rgba(226,216,197,.15);border-radius:6px;background:#121015;color:#a99eaa;font-size:12px !important; }
.tp-filter-select>span { color:#827a86; }
.tp-filter-select select {
  max-width:130px;appearance:none;padding:0 15px 0 0;border:0;background:transparent;
  color:#ded5df;font-size:8px;outline:0;
}
.tp-filter-select option,.tp-sort option { background:#17151c;color:#eee7ef; }
.tp-filter-select>svg { position:absolute;right:7px;pointer-events:none;color:#968998; }
.tp-filter-chip,.tp-sort { min-height:33px;padding:0 9px;border-radius:6px;font-size:8px; }
.tp-sort select { max-width:125px;font-size:8px; }
.tp-family-list { gap:6px;padding:1px 0 6px; }
.tp-family-list button { padding:6px 9px;border-radius:16px;font-size:14px; }
.tp-results-line { padding:8px 0;color:#9c929d;font-size:7px; }
.tp-benefits {
  width:100%;display:grid;grid-template-columns:1fr 1fr 1.2fr auto;align-items:center;
  gap:0;padding:13px 3.6%;border-top:1px solid var(--tp-line);border-bottom:1px solid var(--tp-line);
  background:linear-gradient(90deg,#141218,#0e0d11 48%,#151219);
}
.tp-benefit {
  min-height:41px;display:flex;align-items:center;gap:12px;padding:0 22px;
  border-right:1px solid rgba(216,189,130,.27);color:var(--tp-champagne);
}
.tp-benefit:first-child { padding-left:0; }
.tp-benefit span { display:grid;gap:3px; }
.tp-benefit strong { color:#e6dfe6;font-size:15px;font-weight:500; }
.tp-benefit small { color:#a69da8;font-size:12px; }
.tp-whatsapp-demo {
  min-height:39px;display:flex;align-items:center;justify-content:center;gap:9px;
  margin-left:21px;padding:0 17px;border:1px solid #26be65;border-radius:24px;
  background:linear-gradient(100deg,#149d4e,#2dcf70);color:#fff!important;
  box-shadow:0 0 17px rgba(38,191,100,.17);font-size:9px;font-weight:650;white-space:nowrap;
}
.tp-whatsapp-demo:hover { filter:brightness(1.08);box-shadow:0 0 23px rgba(38,191,100,.31); }
.tp-footer { background:#0b0a0e; }
.tp-footer-main {
  width:94%;max-width:1680px;min-height:66px;display:grid;
  grid-template-columns:1fr auto auto;align-items:center;gap:24px;padding:12px 0;
}
.tp-footer-main .tp-brand-symbol { width:32px;height:32px; }
.tp-footer-main .tp-brand-wordmark { font-size:22px; }
.tp-footer-main .tp-brand-wordmark small { margin-top:4px;font-size:10px; }
.tp-footer-legal { display:flex;align-items:center;gap:14px; }
.tp-footer-legal button {
  padding:0;border:0;background:none;color:#b9b1bb;font-size:14px;white-space:nowrap;
}
.tp-footer-legal button+button { padding-left:14px;border-left:1px solid rgba(226,216,197,.24); }
.tp-footer-social { display:flex;align-items:center;gap:8px; }
.tp-footer-social>span { margin-right:4px;color:#b7afb9;font-size:12px; }
.tp-footer-social button {
  width:30px;height:30px;display:grid;place-items:center;padding:0;
  border:1px solid rgba(226,216,197,.21);border-radius:50%;background:#151319;color:#d7cbd9;
}
.tp-footer-social button:hover { border-color:var(--tp-champagne);color:var(--tp-champagne); }
.tp-footer-bottom { min-height:32px;padding:0 3%;font-size:6px; }
.tp-footer-bottom>span:nth-child(2) { display:inline; }

@media (max-width:1120px) {
  .tp-header { grid-template-columns:minmax(145px,1fr) auto minmax(160px,210px) auto;gap:14px;padding:0 3%; }
  .tp-brand-wordmark { font-size:16px; }
  .tp-nav { gap:14px; }
  .tp-nav button { font-size:9px; }
  .tp-header-actions { gap:12px; }
  .tp-product-grid { gap:8px; }
  .tp-product-copy { padding:8px 9px; }
  .tp-product-name { font-size:14px; }
  .tp-product-cta { min-width:90px;height:30px;font-size:10px; }
  .tp-product-cta>i { width:19px;height:19px; }
  .tp-benefit { padding:0 13px;gap:8px; }
  .tp-whatsapp-demo { margin-left:14px;padding:0 12px; }
}
@media (max-width:760px) {
  .tp-header {
    height:auto;min-height:108px;grid-template-columns:minmax(0,1fr) auto;
    grid-template-rows:60px 39px;gap:0;padding:0 15px 8px;
  }
  .tp-brand-lockup { grid-column:1;grid-row:1; }
  .tp-brand-symbol { width:31px;height:31px; }
  .tp-brand-symbol svg { width:27px;height:27px; }
  .tp-brand-wordmark { font-size:16px; }
  .tp-brand-wordmark small { font-size:6px; }
  .tp-nav {
    display:none;position:absolute;z-index:20;top:107px;left:0;right:0;
    margin:0;padding:9px 17px 14px;background:#111015;border-bottom:1px solid var(--tp-line);
    grid-template-columns:repeat(2,minmax(0,1fr));gap:0 17px;
  }
  .tp-nav.is-open { display:grid; }
  .tp-nav button { padding:12px 3px;border-bottom:1px solid rgba(226,216,197,.08);font-size:10px;text-align:left; }
  .tp-nav button.is-current::after { left:3px;right:auto;bottom:4px;width:24px;height:2px; }
  .tp-header-search { grid-column:1/-1;grid-row:2;height:34px;width:100%; }
  .tp-header-search input { font-size:9px; }
  .tp-header-actions { grid-column:2;grid-row:1;gap:10px; }
  .tp-account-button,.tp-cart-button { width:31px;height:34px; }
  .tp-cart-button b { right:-3px;top:-1px;min-width:16px;height:16px;font-size:8px; }
  .tp-mobile-toggle { display:flex;align-items:center;justify-content:center;width:28px;height:32px;padding:0;border:0;background:none;color:#eee8ef; }
  .tp-hero { height:300px;min-height:300px;padding:0 7%; }
  .tp-hero::before { inset:0;background-position:58% center; }
  .tp-hero::after {
    background:linear-gradient(90deg,rgba(8,7,11,.96) 0%,rgba(8,7,11,.85) 40%,rgba(8,7,11,.32) 76%,rgba(8,7,11,.13) 100%),
      linear-gradient(0deg,rgba(8,7,11,.25),transparent 40%);
  }
  .tp-hero-copy { width:83%;padding-left:2%; }
  .tp-hero .tp-eyebrow { font-size:7px;letter-spacing:1.1px; }
  .tp-hero h1 { margin:12px 0 10px;font-size:clamp(36px,10vw,47px);letter-spacing:-1.5px; }
  .tp-hero-copy>p { max-width:280px;font-size:10px;line-height:1.55; }
  .tp-hero-actions { margin-top:15px; }
  .tp-hero .tp-button-primary { min-height:37px;padding:0 14px;font-size:9px; }
  .tp-hero-indicators { left:3.2%;gap:7px; }
  .tp-hero-indicators span { width:7px;height:7px; }
  .tp-catalog-section { width:92%;padding:18px 0 18px; }
  .tp-section-heading { align-items:center;gap:8px;margin-bottom:10px; }
  .tp-section-heading h2 { margin-top:5px;font-size:25px;letter-spacing:-.6px; }
  .tp-section-heading .tp-eyebrow { font-size:6px;letter-spacing:.75px; }
  .tp-section-heading .tp-eyebrow-line { width:14px; }
  .tp-section-heading .tp-text-link { gap:6px;margin:0;font-size:7px; }
  .tp-round-arrow { width:20px;height:20px; }
  .tp-product-grid { grid-template-columns:repeat(2,minmax(0,1fr));gap:9px; }
  .tp-card-visual { height:clamp(148px,44vw,195px); }
  .tp-gallery { grid-template-columns:minmax(0,1fr) 33px;gap:5px;padding:6px; }
  .tp-gallery-thumb { border-radius:6px; }
  .tp-product-copy { padding:8px 8px 9px; }
  .tp-product-name { margin-bottom:4px;font-size:13px; }
  .tp-product-meta { font-size:6px; }
  .tp-product-bottom { margin-top:7px;padding-top:7px; }
  .tp-product-bottom strong { font-size:10px; }
  .tp-product-bottom small { font-size:5px; }
  .tp-product-cta { min-width:77px;height:27px;gap:4px;padding:0 4px 0 7px;font-size:6px; }
  .tp-product-cta svg { width:12px;height:12px; }
  .tp-product-cta>i { width:17px;height:17px; }
  .tp-product-cta>i svg { width:10px;height:10px; }
  .tp-stock { margin-top:5px;font-size:12px; }
  .tp-audience-filter { flex-wrap:wrap;gap:5px;margin:11px 0 8px; }
  .tp-audience-filter>span { width:100%;font-size:8px; }
  .tp-audience-filter button { min-height:25px;padding:0 9px;font-size:7px; }
  .tp-catalog-tools { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px; }
  .tp-filter-select { min-width:0;justify-content:space-between;min-height:32px;padding:0 7px;font-size:7px; }
  .tp-filter-select select { max-width:calc(100% - 35px);font-size:7px; }
  .tp-filter-select>svg { right:5px;width:11px; }
  .tp-filter-chip,.tp-sort { min-height:31px;justify-content:center;font-size:7px; }
  .tp-filter-chip { gap:5px; }
  .tp-sort { gap:5px;padding:0 5px; }
  .tp-sort select { max-width:104px;font-size:7px; }
  .tp-family-list { flex-wrap:nowrap;gap:5px;overflow-x:auto;padding-bottom:5px; }
  .tp-family-list button { padding:6px 8px;font-size:6px; }
  .tp-results-line { padding:7px 0;font-size:5px;letter-spacing:.65px; }
  .tp-benefits { grid-template-columns:1fr 1fr;gap:0;padding:10px 5%; }
  .tp-benefit { min-height:43px;padding:5px 8px;border-right:0; }
  .tp-benefit:nth-child(2) { border-left:1px solid rgba(216,189,130,.22); }
  .tp-benefit:nth-child(3) { grid-column:1/-1;border-top:1px solid rgba(216,189,130,.16);padding:9px 8px 6px; }
  .tp-benefit svg { width:20px;height:20px;flex:none; }
  .tp-benefit strong { font-size:8px; }
  .tp-benefit small { font-size:6px; }
  .tp-whatsapp-demo { grid-column:1/-1;min-height:38px;margin:9px 0 0;font-size:8px; }
  .tp-footer-main { width:92%;grid-template-columns:1fr;gap:10px;padding:13px 0; }
  .tp-footer-main .tp-brand-symbol { width:28px;height:28px; }
  .tp-footer-main .tp-brand-symbol svg { width:25px;height:25px; }
  .tp-footer-main .tp-brand-wordmark { font-size:14px; }
  .tp-footer-legal { flex-wrap:wrap;gap:7px 10px; }
  .tp-footer-legal button { font-size:6px; }
  .tp-footer-legal button+button { padding-left:10px; }
  .tp-footer-social { gap:6px; }
  .tp-footer-social>span { font-size:6px; }
  .tp-footer-social button { width:22px;height:22px; }
  .tp-footer-social button svg { width:13px;height:13px; }
  .tp-footer-bottom { flex-wrap:wrap;gap:5px 10px;padding:8px 4%;font-size:5px; }
  .tp-footer-bottom>span:nth-child(2) { display:none; }
}
@media (max-width:380px) {
  .tp-header { padding-left:11px;padding-right:11px; }
  .tp-brand-wordmark { font-size:14px; }
  .tp-header-actions { gap:6px; }
  .tp-hero { height:285px;min-height:285px; }
  .tp-hero h1 { font-size:35px; }
  .tp-section-heading h2 { font-size:22px; }
  .tp-product-cta { min-width:70px; }
}
/* Ajuste global de legibilidad - Mínimo 12px -----------------------*/
.tp-root p, 
.tp-root span, 
.tp-root small, 
.tp-root button, 
.tp-root input, 
.tp-root select, 
.tp-root label,
.tp-root th,
.tp-root td,
.tp-root li,
.tp-root div {
  /* Esto asegura que ningún texto baje de 12px, excepto iconos o contenedores */
}

/* Forzamos tamaños específicos para evitar que se rompa el diseño */
.tp-product-meta, 
.tp-product-bottom small, 
.tp-stock, 
.tp-family-list button, 
.tp-filter-select, 
.tp-filter-select select, 
.tp-filter-chip, 
.tp-sort, 
.tp-sort select, 
.tp-results-line, 
.tp-benefit strong, 
.tp-benefit small, 
.tp-footer-legal button, 
.tp-footer-social>span, 
.tp-footer-bottom, 
.tp-eyebrow, 
.tp-section-note, 
.tp-text-link, 
.tp-audience-filter>span, 
.tp-audience-filter button {
  font-size: 12px !important;
}

/* Ajuste para botones importantes que tenían letra muy pequeña */
.tp-product-cta, .tp-whatsapp-demo {
  font-size: 12px !important;
}

/* Ajuste de espacios en móvil para que los textos de 12px no rompan las tarjetas */
@media (max-width: 760px) {
  .tp-product-meta, .tp-stock, .tp-product-bottom small, .tp-family-list button, .tp-results-line {
    font-size: 12px !important;
  }
  .tp-product-name { font-size: 16px !important; }
  .tp-product-copy { padding: 12px 10px !important; }
}
/*AJUSTES DEL CARRITO VISTA DETALLES*/
/* Forzar tamaño en botones del carrito */
.tp-cart-controls .tp-text-link, 
.tp-cart-controls .tp-clear-cart {
  font-size: 14px !important;
}
.tp-cart-summary .tp-checkout-button {
  font-size: 15px !important;
  font-weight: 600 !important;
}
/*BOTON ENCUENTRA TU FAMILIA*/
.tp-discovery .tp-eyebrow { font-size: 16px !important; }
/*---------------------NOMBRE EN DAETALLES PERFUMES DORADO--------*/
.tp-detail-info .tp-eyebrow { font-size: 15px !important; }
`;
