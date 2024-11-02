const pages = [ ["overview", window.Overview],
    ["sales", window.SalesPage],
    ["inventory", window.InventoryPage],
    ["orders", window.OrderPage],
    ["products", window.ProductPage],
    ["profile",  window.ProfilePage],
]


const tabs = ["overview", "sales", "inventory", "orders", "products", "profile"]

const GetRole = () => {
    return fetch("/api/role/")
        .then(response => { 
            if (!response.ok) {
                window.location.href = "/home";
            }
            return response.json();
        })
        .then(data => {
            return data.role;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const GetWarehouse = () => {
    let warehouse = localStorage.getItem("warehouse")
    if (!warehouse) {
        return fetch("/api/")
    }
    return warehouse
}

function LoadPage() {
    const root = document.getElementById('root');
    let last_page = localStorage.getItem("last_page");

    if (!last_page || !tabs.includes(last_page)) {
        localStorage.setItem("last_page", "overview");
        last_page = localStorage.getItem("last_page");
    }

    for (const page of pages) {
        if (page[0] === last_page) {

            const current_page = page[1];

            GetRole().then(role => {
                const result = current_page(role);
                if (result instanceof Promise) {
                    result.then(html => {
                        root.innerHTML = html;
                    });
                } else {
                    root.innerHTML = result;
                }
                //root.innerHTML = current_page(role);
            });
        }
    }
}

const LoadTab = (tab) => {
    localStorage.setItem("last_page", tab.toLowerCase());
    LoadPage();
}

document.addEventListener('DOMContentLoaded', function() {
    LoadPage()
});











/* const handleSubmit = async (e) => {
                  e.preventDefault();
                  const data = new FormData();
                  data.append('name', formData.name);
                  data.append('description', formData.description);
                  data.append('price', formData.price);
                  data.append('file', formData.file);
  
                  try {
                      const response = await axios.post('/api/products/', data, {
                          headers: {
                              'Content-Type': 'multipart/form-data',
                              'X-CSRFToken': getCookie('csrftoken') // Assuming CSRF protection is enabled
                          },
                      });
                      console.log('Success:', response.data);
                  } catch (error) {
                      console.error('Error:', error);
                  }
              };
  
              // Function to get CSRF token (needed if CSRF protection is enabled)
              const getCookie = (name) => {
                  let cookieValue = null;
                  if (document.cookie && document.cookie !== '') {
                      const cookies = document.cookie.split(';');
                      for (let i = 0; i < cookies.length; i++) {
                          const cookie = cookies[i].trim();
                          if (cookie.substring(0, name.length + 1) === (name + '=')) {
                              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                              break;
                          }
                      }
                  }
                  return cookieValue;
              }; */