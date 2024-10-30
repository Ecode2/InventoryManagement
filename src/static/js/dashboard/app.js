const pages = [ ["overview", window.Overview()],
    ["sales", window.SalesPage()],
]

const tabs = ["overview", "sales"]

function LoadPage() {
    const root = document.getElementById('root');
    let last_page = localStorage.getItem("last_page");


    if (!last_page || !tabs.includes(last_page)) {
        localStorage.setItem("last_page", "overview");
        last_page = localStorage.getItem("last_page");
    }

    for (const page of pages) {
        if (page[0] === last_page) {
            root.innerHTML = page[1];
        }
    }
}

const LoadTab = (tab) => {
    localStorage.setItem("last_page", tab.toLowerCase());
    LoadPage();
}

document.addEventListener('DOMContentLoaded', LoadPage());











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