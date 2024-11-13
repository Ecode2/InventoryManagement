
const pages = [ ["overview", window.Overview],
    ["sales", window.SalesPage],
    ["inventory", window.InventoryPage],
    ["orders", window.OrderPage],
    ["products", window.ProductPage],
    ["profile",  window.ProfilePage],
    ["users", window.UserPage],
    ["general", window.GeneralPage],
]


const tabs = ["overview", "sales", "inventory", "orders", "products", "profile", "users", "general"]

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

const GetWarehouse = async () => {
    let warehouse_id = localStorage.getItem("warehouse_id");
    let warehouse_name = localStorage.getItem("warehouse_name")
    let warehouse_address = localStorage.getItem("warehouse_address")
    if (!warehouse_id) {
        try {
            const response = await fetch("/api/manage/warehouses/")

            if (!response.ok) {
                return null;
            }
            const data = await response.json();

            if (!data || !data.results) {
                return null;
            }
            
            let warehouse = data.results[0]
            localStorage.setItem("warehouse_id", warehouse.id);
            localStorage.setItem("warehouse_name", warehouse.name);
            localStorage.setItem("warehouse_address", warehouse.address);
            return warehouse.id;

        }catch(error) {
            console.error('Error:', error);
            return null;
        };
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

    const options = {
        xaxis: {
          show: true,
          categories: ['01 Feb', '02 Feb', '03 Feb', '04 Feb', '05 Feb', '06 Feb', '07 Feb'],
          labels: {
            show: true,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          show: true,
          labels: {
            show: true,
            style: {
              fontFamily: "Inter, sans-serif",
              cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
            },
            formatter: function (value) {
              return '$' + value;
            },
          },
        },
        series: [
          {
            name: "Developer Edition",
            data: [150, 141, 145, 152, 135, 125, 145], // Ensure the series data length matches the xaxis categories length
            color: "#1A56DB",
          },
          {
            name: "Designer Edition",
            data: [43, 13, 65, 12, 42, 73, 53], // Ensure the series data length matches the xaxis categories length
            color: "#7E3BF2",
          },
        ],
        chart: {
          sparkline: {
            enabled: false,
          },
          height: "100%",
          width: "100%",
          type: "area",
          fontFamily: "Inter, sans-serif",
          dropShadow: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        tooltip: {
          enabled: true,
          x: {
            show: false,
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.55,
            opacityTo: 0,
            shade: "#1C64F2",
            gradientToColors: ["#1C64F2"],
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 6,
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
      };
    
      if (document.getElementById("labels-chart") && typeof ApexCharts !== 'undefined') {
        console.log("chart loading", typeof ApexCharts)
        const chart = new ApexCharts(document.getElementById("labels-chart"), options);
        console.log(chart)
        chart.render();
      }

}

const LoadTab = (tab) => {
    localStorage.setItem("last_page", tab.toLowerCase());

    let sidebar_toggle = document.getElementById("drawer-navigation-btn");
    let modal = document.getElementById("drawer-navigation");
    if (sidebar_toggle && window.innerWidth < 768 && modal && modal.classList.contains('transform-none')) {
        sidebar_toggle.click();
    }
    
    LoadPage();
}

document.addEventListener('DOMContentLoaded', function() {
    LoadPage();
});
