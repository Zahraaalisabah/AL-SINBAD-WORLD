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

    loop: true,

    speed: 900,

    autoplay: {
        delay: 4000,
        disableOnInteraction: false
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
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

    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = "0 10px 30px rgba(0,0,0,.15)";
        } else {
            header.style.boxShadow = "0 10px 30px rgba(0,0,0,.08)";
        }
    }

});


// ==============================
// Scroll to top
// ==============================
if (topBtn) {

    topBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


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
// Search
// ==============================
if (typeof searchInput !== "undefined" && searchInput) {

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.trim().toLowerCase();

        document.querySelectorAll(".product-card").forEach(product => {

            const titleElement = product.querySelector("h3");

            if (!titleElement) return;

            const title = titleElement.textContent
                .trim()
                .toLowerCase();

            if (title.includes(value) || value === "") {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });

    });

}


// ======================================================
// جلب وعرض المنتجات من Supabase
// مع جلب التصنيف المرتبط بكل منتج
// ======================================================
async function fetchAndRenderProducts() {

    try {

        const { data: products, error } = await supabaseClient

            .from("products")

            .select(`
                *,
                categories (
                    id,
                    name,
                    slug
                )
            `)

            .order("id", {
                ascending: false
            });


        // ==============================
        // في حالة وجود خطأ
        // ==============================
        if (error) {

            console.error(
                "خطأ في جلب المنتجات:",
                error
            );

            return;
        }


        // ==============================
        // إذا ماكو منتجات
        // ==============================
        if (!products || products.length === 0) {

            console.log("لا توجد منتجات حاليًا.");

            return;
        }


        // ==============================
        // عرض المنتجات
        // ==============================
        products.forEach(product => {


            // التصنيف المرتبط بالمنتج
            const category = product.categories;


            // إذا المنتج ما عنده تصنيف
            if (!category) {

                console.warn(
                    "المنتج لا يحتوي على تصنيف:",
                    product.title
                );

                return;
            }


            // نستخدم slug حتى نحدد القسم بالـ HTML
            const categorySlug = category.slug;


            // البحث عن قسم التصنيف
            const categoryContainer =
                document.querySelector(
                    `#${categorySlug} .products-grid`
                );


            // إذا القسم غير موجود بالـ HTML
            if (!categoryContainer) {

                console.warn(
                    `لم يتم العثور على قسم بالـ ID: #${categorySlug}`
                );

                return;
            }


            // ==============================
            // إنشاء بطاقة المنتج
            // ==============================
            const productHTML = `

                <div
                    class="product-card"
                    data-id="${product.id}"
                    data-category="${category.slug}"
                >

                    <img
                        src="${product.image_url}"
                        alt="${product.title}"
                        loading="lazy"
                    >

                    <h3>
                        ${product.title}
                    </h3>

                    <a
                        href="https://wa.me/9647702901247?text=السلام عليكم، أريد طلب ${encodeURIComponent(product.title)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-small"
                    >

                        <i class="fab fa-whatsapp"></i>

                        اطلب الآن

                    </a>

                </div>

            `;


            // إضافة المنتج للقسم المناسب
            categoryContainer.insertAdjacentHTML(
                "beforeend",
                productHTML
            );

        });


        console.log(
            `تم تحميل ${products.length} منتج بنجاح`
        );

    } catch (err) {

        console.error(
            "حدث خطأ غير متوقع:",
            err
        );

    }

}


// ======================================================
// تشغيل جلب المنتجات عند تحميل الصفحة
// ======================================================
document.addEventListener(
    "DOMContentLoaded",
    fetchAndRenderProducts
);
