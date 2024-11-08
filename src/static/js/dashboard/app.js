/* // Initialize or re-initialize Flowbite components
function initializeFlowbite() {
    console.log("reinitializing")
    // Initialize tooltips
    if (typeof window.Tooltip !== 'undefined') {
        document.querySelectorAll('[data-tooltip-target]').forEach((tooltipTrigger) => {
            new window.Tooltip(tooltipTrigger);
        });
    }

    // Initialize modals
    if (typeof window.Modal !== 'undefined') {
        document.querySelectorAll('[data-modal-target]').forEach((modalTrigger) => {
            new window.Modal(modalTrigger);
        });
    }

    // Initialize dropdowns
    if (typeof window.Dropdown !== 'undefined') {
        document.querySelectorAll('[data-dropdown-target]').forEach((dropdownTrigger) => {
            new window.Dropdown(dropdownTrigger);
        });
    }

    // Initialize tabs
    if (typeof window.Tabs !== 'undefined') {
        document.querySelectorAll('[data-tabs-toggle]').forEach((tabsTrigger) => {
            new window.Tabs(tabsTrigger);
        });
    }

    // Initialize collapses/accordions
    if (typeof window.Collapse !== 'undefined') {
        document.querySelectorAll('[data-collapse-toggle]').forEach((collapseTrigger) => {
            new window.Collapse(collapseTrigger);
        });
    }

    // Initialize carousels
    if (typeof window.Carousel !== 'undefined') {
        document.querySelectorAll('[data-carousel]').forEach((carouselElement) => {
            new window.Carousel(carouselElement);
        });
    }

    // Initialize dismiss components
    if (typeof window.Dismiss !== 'undefined') {
        document.querySelectorAll('[data-dismiss-target]').forEach((dismissTrigger) => {
            new window.Dismiss(dismissTrigger);
        });
    }

    // Initialize drawers
    if (typeof window.Drawer !== 'undefined') {
        document.querySelectorAll('[data-drawer-target]').forEach((drawerTrigger) => {
            new window.Drawer(drawerTrigger);
        });
    }

    // Initialize popovers
    if (typeof window.Popover !== 'undefined') {
        document.querySelectorAll('[data-popover-target]').forEach((popoverTrigger) => {
            new window.Popover(popoverTrigger);
        });
    }

    // Initialize datepickers
    if (typeof window.Datepicker !== 'undefined') {
        document.querySelectorAll('[data-datepicker-target]').forEach((datepickerTrigger) => {
            new window.Datepicker(datepickerTrigger);
        });
    }

    // Initialize timepickers
    if (typeof window.Timepicker !== 'undefined') {
        document.querySelectorAll('[data-timepicker-target]').forEach((timepickerTrigger) => {
            new window.Timepicker(timepickerTrigger);
        });
    }

    // Initialize toggles
    if (typeof window.Toggle !== 'undefined') {
        document.querySelectorAll('[data-toggle-target]').forEach((toggleTrigger) => {
            new window.Toggle(toggleTrigger);
        });
    }

     // Initialize alerts
     if (typeof window.Alert !== 'undefined') {
        document.querySelectorAll('[data-alert-target]').forEach((alertTrigger) => {
            new window.Alert(alertTrigger);
        });
    }

    // Initialize sliders (if any)
    if (typeof window.Slider !== 'undefined') {
        document.querySelectorAll('[data-slider]').forEach((sliderElement) => {
            new window.Slider(sliderElement);
        });
    }

    // Initialize progress bars
    if (typeof window.ProgressBar !== 'undefined') {
        document.querySelectorAll('[data-progress-bar]').forEach((progressBarElement) => {
            new window.ProgressBar(progressBarElement);
        });
    }

    // Initialize spinners
    if (typeof window.Spinner !== 'undefined') {
        document.querySelectorAll('[data-spinner]').forEach((spinnerElement) => {
            new window.Spinner(spinnerElement);
        });
    }

    // Initialize pagination
    if (typeof window.Pagination !== 'undefined') {
        document.querySelectorAll('[data-pagination]').forEach((paginationElement) => {
            new window.Pagination(paginationElement);
        });
    }

    // Initialize list groups
    if (typeof window.ListGroup !== 'undefined') {
        document.querySelectorAll('[data-list-group]').forEach((listGroupElement) => {
            new window.ListGroup(listGroupElement);
        });
    }

    // Initialize notifications
    if (typeof window.Notification !== 'undefined') {
        document.querySelectorAll('[data-notification-target]').forEach((notificationTrigger) => {
            new window.Notification(notificationTrigger);
        });
    }

    // Initialize stepper components
    if (typeof window.Stepper !== 'undefined') {
        document.querySelectorAll('[data-stepper]').forEach((stepperElement) => {
            new window.Stepper(stepperElement);
        });
    }

    // Initialize file uploads
    if (typeof window.FileUpload !== 'undefined') {
        document.querySelectorAll('[data-file-upload]').forEach((fileUploadElement) => {
            new window.FileUpload(fileUploadElement);
        });
    }

    // Initialize range inputs
    if (typeof window.RangeInput !== 'undefined') {
        document.querySelectorAll('[data-range-input]').forEach((rangeInputElement) => {
            new window.RangeInput(rangeInputElement);
        });
    }

    // Initialize rating components
    if (typeof window.Rating !== 'undefined') {
        document.querySelectorAll('[data-rating]').forEach((ratingElement) => {
            new window.Rating(ratingElement);
        });
    }

    // Initialize lightbox
    if (typeof window.Lightbox !== 'undefined') {
        document.querySelectorAll('[data-lightbox]').forEach((lightboxElement) => {
            new window.Lightbox(lightboxElement);
        });
    }

    // Initialize video players
    if (typeof window.VideoPlayer !== 'undefined') {
        document.querySelectorAll('[data-video-player]').forEach((videoPlayerElement) => {
            new window.VideoPlayer(videoPlayerElement);
        });
    }

    // Add more initializations as needed for other Flowbite components
}
 */

const pages = [ ["overview", window.Overview],
    ["sales", window.SalesPage],
    ["inventory", window.InventoryPage],
    ["orders", window.OrderPage],
    ["products", window.ProductPage],
    ["profile",  window.ProfilePage],
]


const tabs = ["overview", "sales", "inventory", "orders", "products", "profile"]

const GetRole = async () => {
    try {
        const response = await fetch("/api/role/");
        if (!response.ok) {
            window.location.href = "/home";
        }
        const data = await response.json();
        return data.role;
    } catch (error) {
        console.error('Error:', error);
    }
}

const GetWarehouse = () => {
    let warehouse_id = localStorage.getItem("warehouse_id");
    let warehouse_name = localStorage.getItem("warehouse_name")
    let warehouse_address = localStorage.getItem("warehouse_address")
    if (!warehouse_id) {
        return fetch("/api/manage/warehouses/")
        .then(response => { 
            if (!response.ok) {
                return null;
            }
            return response.json();
        })

        .then(data => {
            if (!data || !data.results) {
                return null;
            }
            let warehouse = data.results[0]
            localStorage.setItem("warehouse_id", warehouse.id);
            localStorage.setItem("warehouse_name", warehouse.name);
            localStorage.setItem("warehouse_address", warehouse.address);
            return warehouse.id;
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
    }else {
        return Promise.resolve(warehouse_id);
    }
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
                GetWarehouse().then(warehouse_id => {
                    console.log(role)
                    const result = current_page(role, warehouse_id);
                    if (result instanceof Promise) {
                        result.then(html => {
                            root.innerHTML = html;
                            initializeFlowbite();
                        });
                    } else {
                        root.innerHTML = result;
                        initializeFlowbite();
                    }
                });
                //root.innerHTML = current_page(role);
            });
        }
    }
}

const LoadTab = (tab) => {
    localStorage.setItem("last_page", tab.toLowerCase());

    let sidebar_toggle = document.getElementById("drawer-navigation-btn");
    if (sidebar_toggle && window.innerWidth < 768) {
        console.log("clicked");
        sidebar_toggle.click();
    }
    
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