```js
// ======================================================
// AL SINBAD WORLD - MAIN.JS
// ======================================================


// ======================================================
// AOS Animation Init
// ======================================================

AOS.init({
    duration: 800,
    once: true
});


// ======================================================
// Hero Swiper
// ======================================================

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


// ======================================================
// Back To Top Button
// ======================================================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if (topBtn) {

        if (window.scrollY > 400) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }

    }


    // Header shadow

    const header = document.querySelector("header");

    if (header) {

        if (window.scrollY > 100) {

            header.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.15)";

        } else {

            header.style.boxShadow =
                "0 10px 30px rgba(0,0,0,.08)";

        }

    }

});


// ======================================================
// Scroll To Top
// ======================================================

if (topBtn) {

    topBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// ======================================================
// Smooth Scroll For Navigation
// ======================================================

document.querySelectorAll("nav ul li a").forEach(link => {

    link.addEventListener("click", function (e) {

        const target =
            this.getAttribute("href");

        if (target && target.startsWith("#")) {

            e.preventDefault();

            const section =
                document.querySelector(target);

            if (section) {

                window.scrollTo({

                    top: section.offsetTop - 80,

                    behavior: "smooth"

                });

            }

        }

    });

});


// ======================================================
// Search
// ======================================================

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener("input", () => {

        const value =
            searchInput.value
                .trim()
                .toLowerCase();


        document
            .querySelectorAll(".product-card")
            .forEach(product => {

                const titleElement =
                    product.querySelector("h3");


                if (!titleElement) return;


                const title =
                    titleElement.textContent
                        .trim()
                        .toLowerCase();


                if (
                    title.includes(value) ||
                    value === ""
                ) {

                    product.style.display = "block";

                } else {

                    product.style.display = "none";

                }

            });

    });

}


// ======================================================
// Fetch Products From Supabase
// ======================================================

async function fetchAndRenderProducts() {

    try {

        const {
            data: products,
            error
        } = await supabaseClient

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


        // ==================================================
        // Error
        // ==================================================

        if (error) {

            console.error(
                "خطأ في جلب المنتجات:",
                error
            );

            return;

        }


        // ==================================================
        // No Products
        // ==================================================

        if (
            !products ||
            products.length === 0
        ) {

            console.log(
                "لا توجد منتجات حاليًا."
            );

            return;

        }


        // ==================================================
        // Render Products
        // ==================================================

        products.forEach(product => {


            // التصنيف

            const category =
                product.categories;


            // إذا ماكو تصنيف

            if (!category) {

                console.warn(
                    "المنتج لا يحتوي على تصنيف:",
                    product.title
                );

                return;

            }


            const categorySlug =
                category.slug;


            // ==================================================
            // البحث عن القسم
            // ==================================================

            const categoryContainer =
                document.querySelector(
                    `#${categorySlug} .products-grid`
                );


            if (!categoryContainer) {

                console.warn(
                    `لم يتم العثور على قسم بالـ ID: #${categorySlug}`
                );

                return;

            }


            // ==================================================
            // إنشاء بطاقة المنتج
            // ==================================================

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


            // ==================================================
            // إضافة البطاقة
            // ==================================================

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
            "حدث خطأ غير متوقع أثناء تحميل المنتجات:",
            err
        );

    }

}


// ======================================================
// Run Products Fetch
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    fetchAndRenderProducts
);



// ======================================================
// ADMIN PANEL
// ======================================================


// ======================================================
// Admin Password
// ======================================================

const ADMIN_PASSWORD = "123";


// ======================================================
// Admin Elements
// ======================================================

const loginModal =
    document.getElementById("loginModal");

const addProductModal =
    document.getElementById("addProductModal");

const openAdminLoginBtn =
    document.getElementById("openAdminLoginBtn");

const adminLoginForm =
    document.getElementById("adminLoginForm");

const adminLogoutBtn =
    document.getElementById("adminLogoutBtn");

const popAddProductForm =
    document.getElementById("popAddProductForm");


// ======================================================
// Open Admin Login
// ======================================================

if (
    openAdminLoginBtn &&
    loginModal
) {

    openAdminLoginBtn.addEventListener(
        "click",
        () => {

            loginModal.style.display = "block";

        }
    );

}


// ======================================================
// Close Admin Modal
// ======================================================

function closeAdminModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.style.display = "none";

    }

}


// ======================================================
// Admin Login
// ======================================================

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const passwordInput =
                document.getElementById(
                    "adminPassword"
                );


            if (!passwordInput) {

                console.error(
                    "adminPassword غير موجود"
                );

                return;

            }


            const password =
                passwordInput.value;


            // ==================================================
            // Correct Password
            // ==================================================

            if (
                password === ADMIN_PASSWORD
            ) {

                // إغلاق تسجيل الدخول

                if (loginModal) {

                    loginModal.style.display =
                        "none";

                }


                passwordInput.value = "";


                // تحميل الأقسام

                await loadModalCategories();


                // فتح لوحة الإدارة

                if (addProductModal) {

                    addProductModal.style.display =
                        "block";

                }

            }


            // ==================================================
            // Wrong Password
            // ==================================================

            else {

                alert(
                    "كلمة السر غير صحيحة!"
                );

            }

        }
    );

}


// ======================================================
// Admin Logout
// ======================================================

if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener(
        "click",
        () => {

            if (addProductModal) {

                addProductModal.style.display =
                    "none";

            }

        }
    );

}


// ======================================================
// Load Categories
// ======================================================

async function loadModalCategories() {

    try {

        const {
            data: categories,
            error
        } = await supabaseClient

            .from("categories")

            .select("*")

            .order("id", {
                ascending: true
            });


        // ==================================================
        // Error
        // ==================================================

        if (error) {

            console.error(
                "خطأ في تحميل الأقسام:",
                error
            );

            alert(
                "تعذر تحميل الأقسام."
            );

            return;

        }


        const select =
            document.getElementById(
                "popCategory"
            );


        if (!select) {

            console.error(
                "popCategory غير موجود في HTML"
            );

            return;

        }


        select.innerHTML = "";


        // ==================================================
        // No Categories
        // ==================================================

        if (
            !categories ||
            categories.length === 0
        ) {

            alert(
                "لا توجد أقسام في قاعدة البيانات."
            );

            return;

        }


        // ==================================================
        // Add Categories
        // ==================================================

        categories.forEach(cat => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                cat.id;


            option.textContent =
                cat.name;


            select.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "Category Error:",
            error
        );

        alert(
            "حدث خطأ أثناء تحميل الأقسام."
        );

    }

}


// ======================================================
// Add Product
// ======================================================

if (popAddProductForm) {

    popAddProductForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            // ==================================================
            // Get Values
            // ==================================================

            const titleInput =
                document.getElementById(
                    "popTitle"
                );


            const categoryInput =
                document.getElementById(
                    "popCategory"
                );


            const imageInput =
                document.getElementById(
                    "popImage"
                );


            if (
                !titleInput ||
                !categoryInput ||
                !imageInput
            ) {

                console.error(
                    "أحد عناصر نموذج إضافة المنتج غير موجود."
                );

                return;

            }


            const title =
                titleInput.value.trim();


            const categoryId =
                categoryInput.value;


            const file =
                imageInput.files[0];


            // ==================================================
            // Validation
            // ==================================================

            if (!title) {

                alert(
                    "يرجى كتابة اسم المنتج."
                );

                return;

            }


            if (!file) {

                alert(
                    "يرجى اختيار صورة المنتج."
                );

                return;

            }


            // ==================================================
            // Submit Button
            // ==================================================

            const submitBtn =
                popAddProductForm.querySelector(
                    "button[type='submit']"
                );


            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> جاري النشر...';

            }


            try {

                // ==================================================
                // Image File Name
                // ==================================================

                const fileName =
                    `${Date.now()}_${file.name}`;


                // ==================================================
                // Upload Image
                // ==================================================

                const {
                    error: uploadError
                } = await supabaseClient.storage

                    .from("product-images")

                    .upload(
                        fileName,
                        file
                    );


                if (uploadError) {

                    console.error(
                        "Upload Error:",
                        uploadError
                    );

                    alert(
                        "حدث خطأ أثناء رفع الصورة:\n" +
                        uploadError.message
                    );

                    return;

                }


                // ==================================================
                // Get Public URL
                // ==================================================

                const {
                    data: publicUrlData
                } = supabaseClient.storage

                    .from("product-images")

                    .getPublicUrl(
                        fileName
                    );


                const imageUrl =
                    publicUrlData.publicUrl;


                // ==================================================
                // Insert Product
                // ==================================================

                const {
                    error: insertError
                } = await supabaseClient

                    .from("products")

                    .insert([

                        {
                            title: title,

                            category_id:
                                categoryId,

                            image_url:
                                imageUrl
                        }

                    ]);


                // ==================================================
                // Insert Error
                // ==================================================

                if (insertError) {

                    console.error(
                        "Insert Error:",
                        insertError
                    );

                    alert(
                        "حدث خطأ أثناء حفظ المنتج:\n" +
                        insertError.message
                    );

                    return;

                }


                // ==================================================
                // Success
                // ==================================================

                alert(
                    "تم نشر المنتج بنجاح ✅"
                );


                if (addProductModal) {

                    addProductModal.style.display =
                        "none";

                }


                popAddProductForm.reset();


                // ==================================================
                // Reload Page
                // ==================================================

                location.reload();


            } catch (error) {

                console.error(
                    "Unexpected Error:",
                    error
                );

                alert(
                    "حدث خطأ غير متوقع."
                );


            } finally {

                if (submitBtn) {

                    submitBtn.disabled = false;

                    submitBtn.innerHTML =
                        '<i class="fa-solid fa-check"></i> حفظ ونشر المنتج';

                }

            }

        }
    );

}


// ======================================================
// Close Modal When Clicking Outside
// ======================================================

window.addEventListener(
    "click",
    (event) => {

        if (
            event.target === loginModal
        ) {

            loginModal.style.display =
                "none";

        }


        if (
            event.target === addProductModal
        ) {

            addProductModal.style.display =
                "none";

        }

    }
);
```
