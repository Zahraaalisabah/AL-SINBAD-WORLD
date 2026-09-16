const SUPABASE_URL = "https://oolthhsdewchdkuojahl.supabase.co";
const SUPABASE_KEY = "sb_publishable_K9MBG_wuPlWY25Lv5lEpJQ_wph27Xs";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("addProductForm");
const adminProductsList = document.getElementById("adminProductsList");

// جلب المنتجات وعرضها
async function loadAdminProducts() {
    const { data: products, error } = await supabaseClient
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) return console.error(error);

    adminProductsList.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.image_url}" width="50" style="border-radius: 6px;"></td>
            <td>${p.title}</td>
            <td>${p.category}</td>
            <td><button class="btn-delete" onclick="deleteProduct(${p.id})">حذف</button></td>
        </tr>
    `).join('');
}

// إضافة منتج جديد
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("pTitle").value;
    const category = document.getElementById("pCategory").value;
    const image_url = document.getElementById("pImage").value;

    const { error } = await supabaseClient
        .from('products')
        .insert([{ title, category, image_url }]);

    if (error) {
        alert("حدث خطأ أثناء الإضافة!");
    } else {
        alert("تمت إضافة المنتج بنجاح!");
        form.reset();
        loadAdminProducts();
    }
});

// حذف منتج
async function deleteProduct(id) {
    if (confirm("هل أنت تأكد من حذف هذا المنتج؟")) {
        const { error } = await supabaseClient.from('products').delete().eq('id', id);
        if (!error) loadAdminProducts();
    }
}

loadAdminProducts();
