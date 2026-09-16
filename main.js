const SUPABASE_URL = "https://oolthhsdewchdkuojahl.supabase.co";

const SUPABASE_KEY = "sb_publishable_K9MBG_wuPlWY25Lv5lEpJQ_wph27Xs";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
// ==============================
// AOS Animation Init
// ==============================
AOS.init({
    duration: 800,
    once: true
});

// ==============================
// Hero Swiper (Slider)
// ==============================
const heroSwiper = new Swiper(".heroSwiper", {

loop:true,

speed:900,

autoplay:{
delay:4000,
disableOnInteraction:false
},

pagination:{
el:".swiper-pagination",
clickable:true
},

navigation:{
nextEl:".swiper-button-next",
prevEl:".swiper-button-prev"
}

});
// ==============================
// Back To Top Button
// ==============================
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }

    // Header shadow on scroll
    const header = document.querySelector("header");
    if (window.scrollY > 100) {
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.15)";
    } else {
        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.08)";
    }
});

// Scroll to top
topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ==============================
// Smooth scroll for nav links
// ==============================
document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener("click", function (e) {
        const target = this.getAttribute("href");

        if (target && target.startsWith("#")) {
            e.preventDefault();

            const section = document.querySelector(target);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        }
    });
});

// ==============================
// Search focus effect
// ==============================
searchInput.addEventListener("input", () => {

    const value = searchInput.value.trim().toLowerCase();

    document.querySelectorAll(".product-card").forEach(product => {

        const title = product.querySelector("h3").textContent.trim().toLowerCase();

        if (title.indexOf(value) > -1 || value === "") {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }

    });

});








// جلب وعرض المنتجات الديناميكية من Supabase
async function fetchAndRenderProducts() {
    const { data: products, error } = await supabaseClient
        .from('products')
        .select('*');

    if (error) {
        console.error("خطأ في جلب المنتجات:", error);
        return;
    }

    products.forEach(product => {
        const categoryContainer = document.querySelector(`#${product.category} .products-grid`);
        if (categoryContainer) {
            const productHTML = `
                <div class="product-card" data-id="${product.id}">
                    <img src="${product.image_url}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <a href="https://wa.me/9647702901247?text=السلام عليكم، أريد طلب ${encodeURIComponent(product.title)}" target="_blank" class="btn-small">
                        <i class="fab fa-whatsapp"></i> اطلب الآن
                    </a>
                </div>
            `;
            categoryContainer.insertAdjacentHTML('beforeend', productHTML);
        }
    });
}

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", fetchAndRenderProducts);


