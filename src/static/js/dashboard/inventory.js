const inventories = async (role, page) => {
    if (!page) {
        if (role == "admin") {
                page = "/api/shelf/inventories/"
            }
        let warehouse_id = localStorage.getItem("warehouse_id");
        if (warehouse_id) {
            page = `/api/shelf/inventories?warehouse=${warehouse_id}`;
        } else {
            page = `/api/shelf/inventories`;
        }

        /* http://api.example.org/inventories/?cost_price_range_min=100&cost_price_range_max=200
          http://api.example.org/inventories/?min_stock_gte=10
            http://api.example.org/inventories/?max_stock_lte=50
            http://api.example.org/inventories/?created_at_range_after=2023-01-01&created_at_range_before=2023-12-31
            http://api.example.org/inventories/?min_stock_gte=10&max_stock_lte=50&cost_price_range_min=100&cost_price_range_max=200
         */
    }

    try {
        const data = await fetch(page);
        if (!data.ok) {
            DisplayMessage("Couldn't get inventory. Try again", "error");
            return null;
        }

        const response = await data.json();
        if (!data) return null;
        if (response.count == 0) {
            DisplayMessage("No Inventory Available", "warning");
            return null;
        }

        const count = response.count;
        const next = response.next;
        const previous = response.previous;
        const results = response.results;

        table_head = ``;
        if (role === "admin") {
            table_head = `<th scope="col" class="p-4">Sales</th>
                        <th scope="col" class="p-4">Revenue</th>
                        `;
        }
        html = `<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="p-4">
                            <div class="flex items-center">
                                <input id="checkbox-all" type="checkbox" class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <label for="checkbox-all" class="sr-only">checkbox</label>
                            </div>
                        </th>
                        <th scope="col" class="p-4">Product</th>
                        <th scope="col" class="p-4">Category</th>
                        <th scope="col" class="p-4">Stock</th>
                        <th scope="col" class="p-4">Sales/Day</th>
                        <th scope="col" class="p-4">Sales/Month</th>
                        ${table_head}
                        <th scope="col" class="p-4">Info</th>
                    </tr>
                </thead>
        <tbody>`;

        inventory_modals = ``;

        for (const inventory of results) {
            const categories = inventory.product.category.map((category) => category.name);
            const files = inventory.product.files.map((file) => file.file);

            image = files.length ? `<img src="${files[0]}" alt="${inventory.product.name}-Image" class="h-8 w-auto mr-3">` : '';
            let category = categories.length ? `<span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">${categories[0]}</span>` : '';

            let admin_access_info = ``;
            let edit_btn = ``;
            let delete_btn = ``;
            let update_modal = "";
            let delete_modal = "";

            if (role === "admin") {
                admin_access_info += `
                    <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-gray-400 mr-2" aria-hidden="true">
                                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                            </svg>
                            ${inventory.total_sales}
                        </div>
                    </td>
                    <td class="px-4 py-3">#${inventory.revenue}</td>`;

                edit_btn += `
                    <li>
                        <button type="button" data-drawer-target="drawer-update-product-${inventory.id}" data-drawer-show="drawer-update-product-${inventory.id}" onclick="toggleModal('drawer-update-product-${inventory.id}')"
                        aria-controls="drawer-update-product-${inventory.id}" class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200">
                            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                            Edit
                        </button>
                    </li`;

                update_modal = `
                    <form action="#" id="drawer-update-product-${inventory.id}" class="fixed top-0 left-0 z-50 w-full h-screen max-w-3xl p-4 overflow-y-auto transition-transform -translate-x-full bg-white dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-update-product-${inventory.id}-label" aria-hidden="true">
                        <h5 id="drawer-label" class="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">New Product</h5>
                        <button type="button" data-drawer-dismiss="drawer-update-product-${inventory.id}" aria-controls="drawer-update-product-${inventory.id}" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            <span class="sr-only">Close menu</span>
                        </button>
                        <div class="grid gap-4 sm:grid-cols-3 sm:gap-6 ">
                            <div class="space-y-4 sm:col-span-2 sm:space-y-6">
                                <div>
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                                    <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="Apple iMac 27&ldquo;" placeholder="Type product name" required="">
                                </div>
                                <div>
                                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                    <div class="w-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                        <div class="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                                            <div class="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                                                <div class="flex items-center space-x-1 sm:pr-4">
                                                    <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd" />
                                                        </svg>
                                                        <span class="sr-only">Attach file</span>
                                                    </button>
                                                    <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                                        </svg>
                                                        <span class="sr-only">Embed map</span>
                                                    </button>
                                                    <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                                        </svg>
                                                        <span class="sr-only">Upload image</span>
                                                    </button>
                                                    <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                        </svg>
                                                        <span class="sr-only">Format code</span>
                                                    </button>
                                                    <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd" />
                                                        </svg>
                                                        <span class="sr-only">Add emoji</span>
                                                    </button>
                                                </div>
                                                <div class="flex-wrap items-center hidden space-x-1 sm:flex sm:pl-4">
                                                    <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                                                        </svg>
                                                        <span class="sr-only">Add list</span>
                                                    </button>
                                                    <button type="button" class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                                                        </svg>
                                                        <span class="sr-only">Settings</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <button type="button" data-tooltip-target="tooltip-fullscreen" class="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Full screen</span>
                                            </button>
                                            <div id="tooltip-fullscreen" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="bottom" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(0px, 335px, 0px);">
                                                Show full screen
                                                <div class="tooltip-arrow" data-popper-arrow=""></div>
                                            </div>
                                        </div>
                                        <div class="px-4 py-3 bg-white rounded-b-lg dark:bg-gray-800"><textarea id="description" rows="8" class="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write product description here" required="">Standard glass, 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US</textarea></div>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Images</span>
                                    <div class="grid grid-cols-3 gap-4 mb-4">
                                        <div class="relative p-2 bg-gray-100 rounded-lg sm:w-36 sm:h-36 dark:bg-gray-700">
                                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-side-image.png" alt="imac image">
                                            <button type="button" class="absolute text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 bottom-1 left-1">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Remove image</span>
                                            </button>
                                        </div>
                                        <div class="relative p-2 bg-gray-100 rounded-lg sm:w-36 sm:h-36 dark:bg-gray-700">
                                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png" alt="imac image">
                                            <button type="button" class="absolute text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 bottom-1 left-1">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Remove image</span>
                                            </button>
                                        </div>
                                        <div class="relative p-2 bg-gray-100 rounded-lg sm:w-36 sm:h-36 dark:bg-gray-700">
                                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-back-image.png" alt="imac image">
                                            <button type="button" class="absolute text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 bottom-1 left-1">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Remove image</span>
                                            </button>
                                        </div>
                                        <div class="relative p-2 bg-gray-100 rounded-lg sm:w-36 sm:h-36 dark:bg-gray-700">
                                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-side-image.png" alt="imac image">
                                            <button type="button" class="absolute text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400 bottom-1 left-1">
                                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                                </svg>
                                                <span class="sr-only">Remove image</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-center w-full">
                                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span class="font-semibold">Click to upload</span>
                                                    or drag and drop
                                                </p>
                                                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                            <input id="dropzone-file" type="file" class="hidden">
                                        </label>
                                    </div>
                                </div>
                                <div class="flex items-center mb-4">
                                    <input id="product-options" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                    <label for="product-options" class="ml-2 text-sm text-gray-500 dark:text-gray-300">Product has multiple options, like different colors or sizes</label>
                                </div>
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <input datepicker="" id="datepicker" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 datepicker-input" value="15/08/2022" placeholder="Select date">
                                </div>
                            </div>
                            <div class="space-y-4 sm:space-y-6">
                                <div>
                                    <label for="product-brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
                                    <input type="text" id="product-brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="Apple" placeholder="Product Brand" required="">
                                </div>
                                <div><label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label><select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"><option selected="">Electronics</option><option value="TV">TV/Monitors</option><option value="PC">PC</option><option value="GA">Gaming/Console</option><option value="PH">Phones</option></select></div>
                                <div>
                                    <label for="item-weight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (kg)</label>
                                    <input type="number" name="item-weight" id="item-weight" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="12" placeholder="Ex. 12" required="">
                                </div>
                                <div>
                                    <label for="length" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Length (cm)</label>
                                    <input type="number" name="length" id="lenght" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="105" placeholder="Ex. 105" required="">
                                </div>
                                <div>
                                    <label for="breadth" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Breadth (cm)</label>
                                    <input type="number" name="breadth" id="breadth" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="15" placeholder="Ex. 15" required="">
                                </div>
                                <div>
                                    <label for="width" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Width (cm)</label>
                                    <input type="number" name="width" id="width" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value="23" placeholder="Ex. 23" required="">
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-6 sm:w-1/2">
                            <button type="submit" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Update product</button>
                            <button type="button" class="text-red-600 inline-flex justify-center items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                                <svg aria-hidden="true" class="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </form>`;


                delete_btn += `
                    <li>
                        <button type="button" data-modal-target="delete-modal-${inventory.id}" data-modal-toggle="delete-modal-${inventory.id}" onclick="toggleModal('delete-modal-${inventory.id}')"
                        class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400">
                            <svg class="w-4 h-4 mr-2" viewbox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                            </svg>
                            Delete
                        </button>
                    </li>`;
                
                delete_modal = `
                    <!-- Delete Modal -->
                    <div id="delete-modal-${inventory.id}" tabindex="-1" class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div class="relative w-full h-auto max-w-md max-h-full">
                            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="delete-modal-${inventory.id}">
                                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                                <div class="p-6 text-center">
                                    <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                                    <button data-modal-toggle="delete-modal-${inventory.id}" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">Yes, I'm sure</button>
                                    <button data-modal-toggle="delete-modal-${inventory.id}" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            alert_color = ``;
            if (inventory.stock <= inventory.alert_level && inventory.stock <= inventory.min_stock) {
                alert_color += `red`;
            }else if (inventory.stock <= inventory.alert_level && inventory.stock > inventory.min_stock) {
                alert_color += `yellow`;
            }else {
                alert_color += `green`;
            }

            html += `
                <tr class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td class="p-4 w-4">
                        <div class="flex items-center">
                            <input id="checkbox-table-search-1" type="checkbox" onclick="event.stopPropagation()" class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                            <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
                        </div>
                    </td>
                    <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div class="flex items-center mr-3">
                            ${image}
                            <div class="text-base font-semibold">${inventory.product.name}</div>
                        </div>
                    </th>
                    <td class="px-4 py-3">
                        ${category}
                    </td>
                    <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div class="flex items-center">
                            <div class="h-4 w-4 rounded-full inline-block mr-2 bg-${alert_color}-700"></div>
                            ${inventory.stock}
                        </div>
                    </td>
                    <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${inventory.sales_day}</td>
                    <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${inventory.sales_month}</td>
                    ${admin_access_info}
                    <td class="px-4 py-3 flex items-center justify-center">                    
                        <button id="${inventory.id}-${inventory.product.id}-dropdown-button" data-dropdown-toggle="${inventory.id}-${inventory.product.id}-dropdown"
                        class="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </button>
                        <div id="${inventory.id}-${inventory.product.id}-dropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                            <ul class="py-1 text-sm" aria-labelledby="${inventory.id}-${inventory.product.id}-dropdown-button">
                                ${edit_btn}
                                <li>
                                    <button type="button" data-drawer-target="drawer-read-product-${inventory.id}-advanced" data-drawer-show="drawer-read-product-${inventory.id}-advanced" onclick="toggleModal('drawer-read-product-${inventory.id}-advanced')"
                                    aria-controls="drawer-read-product-${inventory.id}-advanced" class="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        Preview
                                    </button>
                                </li>
                                ${delete_btn}
                            </ul>
                        </div>
                    </td>
                </tr>`;
            
            
            preview_modal = `
                <!-- Preview Drawer -->
                <div id="drawer-read-product-${inventory.id}-advanced" class="overflow-y-auto fixed top-0 left-0 z-50 p-4 w-full max-w-lg h-screen bg-white transition-transform -translate-x-full dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-label" aria-hidden="true">
                    <div>
                        <h4 id="read-drawer-label" class="mb-1.5 leading-none text-xl font-semibold text-gray-900 dark:text-white">Apple iMac 25"</h4>
                        <h5 class="mb-5 text-xl font-bold text-gray-900 dark:text-white">$2999</h5>
                    </div>
                    <button type="button" data-drawer-dismiss="drawer-read-product-${inventory.id}-advanced" aria-controls="drawer-read-product-${inventory.id}-advanced" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">Close menu</span>
                    </button>
                    <div class="grid grid-cols-3 gap-4 mb-4 sm:mb-5">
                        <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-side-image.png" alt="iMac Side Image">
                        </div>
                        <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png" alt="iMac Front Image">
                        </div>
                        <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-back-image.png" alt="iMac Back Image">
                        </div>
                        <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-side-image.png" alt="iMac Back Image">
                        </div>
                        <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-back-image.png" alt="iMac Front Image">
                        </div>
                        <div class="p-2 w-auto bg-gray-100 rounded-lg dark:bg-gray-700">
                            <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-side-image.png" alt="iMac Side Image">
                        </div>
                    </div>
                    <dl class="sm:mb-5"><dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Details</dt><dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US.</dd></dl>
                    <dl class="grid grid-cols-2 gap-4 mb-4">
                        <div class="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Shipping</dt>
                            <dd class="flex items-center text-gray-500 dark:text-gray-400">
                                <svg class="w-4 h-4 mr-1.5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                                </svg>
                                United States, Europe
                            </dd>
                        </div>
                        <div class="col-span-2 p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 sm:col-span-1 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Colors</dt>
                            <dd class="flex items-center space-x-2 font-light text-gray-500 dark:text-gray-400">
                                <div class="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full"></div>
                                <div class="flex-shrink-0 w-6 h-6 bg-indigo-400 rounded-full"></div>
                                <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600"></div>
                                <div class="flex-shrink-0 w-6 h-6 bg-pink-400 rounded-full"></div>
                                <div class="flex-shrink-0 w-6 h-6 bg-teal-300 rounded-full"></div>
                                <div class="flex-shrink-0 w-6 h-6 bg-green-300 rounded-full"></div>
                            </dd>
                        </div>
                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Product State</dt>
                            <dd class="text-gray-500 dark:text-gray-400">
                                <span class="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                    <svg aria-hidden="true" class="mr-1 w-3 h-3" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    New
                                </span>
                            </dd>
                        </div>
                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600"><dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Sold by</dt><dd class="text-gray-500 dark:text-gray-400">Flowbite</dd></div>
                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600"><dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Ships from</dt><dd class="text-gray-500 dark:text-gray-400">Flowbite</dd></div>
                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600"><dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Brand</dt><dd class="text-gray-500 dark:text-gray-400">Apple</dd></div>
                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600"><dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Dimensions (cm)</dt><dd class="text-gray-500 dark:text-gray-400">105 x 15 x 23</dd></div>
                        <div class="p-3 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600"><dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Item weight</dt><dd class="text-gray-500 dark:text-gray-400">12kg</dd></div>
                    </dl>
                    <div class="flex bottom-0 left-0 justify-center pb-4 space-x-4 w-full">
                        <button type="button" class="text-white w-full inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            <svg aria-hidden="true" class="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                            </svg>
                            Edit
                        </button>
                        <button type="button" class="inline-flex w-full items-center text-white justify-center bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                            <svg aria-hidden="true" class="w-5 h-5 mr-1.5 -ml-1" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                            </svg>
                            Delete
                        </button>
                    </div>
                </div>`;
            

            inventory_modals += `
                ${update_modal}
                ${preview_modal}
                ${delete_modal}
                `;
        };

        html += `
                </tbody>
            </table>
            ${inventory_modals}`;

        paginator = ``;
        let prev = "";
        let prev_url = previous;
        let nxt = "";
        let nxt_url = next;

        if (previous) {
            let prevRegex = /[?&]page=(\d+)/;
            let match = url.match(prevRegex);
            if (match) {
                prev = match[1];
            }else {
                prev = "1"
            }
        } else {
            prev_url = null;
        }

        if (next) {
            let nxtRegex = /[?&]page=(\d+)/;
            let match = url.match(nxtRegex);
            if (match) {
                nxt = match[1];
            }
        } else {
            nxt_url = null;
        }

        paginator += `<nav class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 p-4" aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    <span class="font-semibold text-gray-900 dark:text-white">${count}</span>
                    Results
                </span>
                <ul class="inline-flex items-stretch -space-x-px">
                    <li>
                        <div onclick="load_inventory('${role || null}', '${prev_url}')" 
                        class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span class="sr-only">Previous</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </li>
                    <li>
                        <div onclick="load_inventory('${role || null}', '${prev_url}')" 
                        class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${prev}</div>
                    </li>
                    <li>
                        <div onclick="load_inventory('${role || null}', '${nxt_url}')" 
                        class="flex items-center justify-center h-full text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">${nxt}</div>
                    </li>
                    <li>
                        <div onclick="load_inventory('${role || null}', '${nxt_url}')" 
                        class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <span class="sr-only">Next</span>
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </li>
                </ul>
            </nav>`;

        return { html, count, next, previous, results, paginator };
        
    } catch(error) {
    console.error("Error:", error);
    DisplayMessage("An error occurred", "error");
    return null;
    };
};


let debounceInventoryTimeout;
const debounceSearchInventory = (search_input, role) => {
  clearTimeout(debounceInventoryTimeout);
  debounceInventoryTimeout = setTimeout(() => searchInventory(search_input, role), 1000);
}
const searchInventory = async (search_input, role) => {
    const input_value = search_input.value;

    if (input_value.length >= 3) {
        // search for the item
        load_inventory(role, `/api/shelf/inventories/?search=${input_value}`)
    } else {
        // load the normal page if input length is less than 3
        load_inventory(role)
    }
}

const load_inventory = async (role, page) => {
    let categories = "";
    let order = "";
  
    role = "" ? role == "null" : role
    let sorting = ""
    let response
    console.log("starting")
  
    try {
      if (page && page != "") {
        response = await inventories(role, page+sorting);

      }else {
        let warehouse_id = localStorage.getItem("warehouse_id");
        let new_page = "/api/shelf/inventories"
  
        if (warehouse_id && role != "admin") {
          new_page = `/api/shelf/inventories/?warehouse=${warehouse_id}`;
        }

        response = await inventories(role, new_page+sorting);
      }
      
      if (!response) {
        console.log("something went wrong")
        return
      }
  
      let html = "";
      let count = "";
      let paginator = "";
      
      if (response && response.html) {
        html = response.html;
        count = response.count;
        paginator = response.paginator;
      }
      const inventory_section = document.getElementById("inventory-section");

      const total = document.getElementById("total-results");
      const total_tooltip = document.getElementById("results-tooltip");

      const pagination_section = document.getElementById("inventory_pagination");
  
      inventory_section.innerHTML = "";
      inventory_section.innerHTML = html;

      total.innerText = count;
      total_tooltip.innerHTML = `Showing 50 of ${count} results
                                <div class="tooltip-arrow" data-popper-arrow=""></div>
                                `;
  
      pagination_section.innerHTML = "";
      pagination_section.innerHTML = paginator
  
    }catch {
      console.log("error")
      return
    }
  };


async function InventoryPage(role) {
    
    const response = await inventories(role);
    let html = "";
    let results = "";
    let count = ""
    let paginator = "";

    if (response && response.html) {
        html = response.html;
        results = response.results;
        paginator = response.paginator;
        count = response.count;
    }

    return `
        <!-- Start block -->
        <section class="bg-gray-50 dark:bg-gray-900 antialiased">
            <div class="mx-auto max-w-screen-2xl">
                <div class="bg-white dark:bg-gray-800 relative h-screen shadow-md sm:rounded-lg overflow-hidden">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4 p-4">
                        <div class="flex-1 flex items-center space-x-2">
                            <h5>
                                <span class="text-gray-500">All Products:</span>
                                <span id="total-results" class="dark:text-white">${count}</span>
                            </h5>
                            <button type="button" class="group" data-tooltip-target="results-tooltip">
                                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" viewbox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                </svg>
                                <span class="sr-only">More info</span>
                            </button>
                            <div id="results-tooltip" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                Showing 50 of ${count} results
                                <div class="tooltip-arrow" data-popper-arrow=""></div>
                            </div>
                        </div>
                        <div class="flex-shrink-0 flex flex-col items-start sm:flex-row sm:items-center lg:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                            <button type="button" class="flex-shrink-0 inline-flex items-center justify-center py-2 px-3 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor" class="mr-2 w-4 h-4" aria-hidden="true">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
                                </svg>
                                Table settings
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
                        <div class="w-full md:w-1/2">
                            <form class="flex items-center">
                                <label for="simple-search" class="sr-only">Search</label>
                                <div class="relative w-full">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                                        </svg>
                                    </div>
                                    <input type="text" id="simple-search" placeholder="Search for products" required="" oninput="debounceSearchInventory(this, '${role}')"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                </div>
                            </form>
                        </div>
                        <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                            <button type="button" id="createProductButton" data-modal-toggle="createProductModal" class="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                <svg class="h-3.5 w-3.5 mr-1.5 -ml-1" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                </svg>
                                Add product
                            </button>
                            <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="h-4 w-4 mr-1.5 -ml-1 text-gray-400" viewbox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                                </svg>
                                Filter options
                                <svg class="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            <div id="filterDropdown" class="z-10 hidden px-3 pt-1 bg-white rounded-lg shadow w-80 dark:bg-gray-700 right-0">
                                <div class="flex items-center justify-between pt-2">
                                    <h6 class="text-sm font-medium text-black dark:text-white">Filters</h6>
                                    <div class="flex items-center space-x-3">
                                        <a href="#" class="flex items-center text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline">Save view</a>
                                        <a href="#" class="flex items-center text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline">Clear all</a>
                                    </div>
                                </div>
                                <div class="pt-3 pb-2">
                                    <label for="input-group-search" class="sr-only">Search</label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <input type="text" id="input-group-search" class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search keywords...">
                                    </div>
                                </div>
                                <div id="accordion-flush" data-accordion="collapse" data-active-classes="text-black dark:text-white" data-inactive-classes="text-gray-500 dark:text-gray-400">
                                    <!-- Category -->
                                    <h2 id="category-heading">
                                        <button type="button" class="flex items-center justify-between w-full py-2 px-1.5 text-sm font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700" data-accordion-target="#category-body" aria-expanded="true" aria-controls="category-body">
                                            <span>Category</span>
                                            <svg aria-hidden="true" data-accordion-icon="" class="w-5 h-5 rotate-180 shrink-0" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="category-body" class="hidden" aria-labelledby="category-heading">
                                        <div class="py-2 font-light border-b border-gray-200 dark:border-gray-600">
                                            <ul class="space-y-2">
                                                <li class="flex items-center">
                                                    <input id="apple" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="apple" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Apple (56)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="microsoft" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="microsoft" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Microsoft (45)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="logitech" type="checkbox" value="" checked="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="logitech" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Logitech (97)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="sony" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="sony" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Sony (234)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="asus" type="checkbox" value="" checked="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="asus" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Asus (97)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="dell" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="dell" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Dell (56)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="msi" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="msi" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">MSI (97)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="canon" type="checkbox" value="" checked="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="canon" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Canon (49)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="benq" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="benq" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">BenQ (23)</label>
                                                </li>
                                                <li class="flex items-center">
                                                    <input id="razor" type="checkbox" value="" class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                                    <label for="razor" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Razor (49)</label>
                                                </li>
                                                <a href="#" class="flex items-center text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline">View all</a>
                                            </ul>
                                        </div>
                                    </div>
                                    <!-- Price -->
                                    <h2 id="price-heading">
                                        <button type="button" class="flex items-center justify-between w-full py-2 px-1.5 text-sm font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700" data-accordion-target="#price-body" aria-expanded="true" aria-controls="price-body">
                                            <span>Price</span>
                                            <svg aria-hidden="true" data-accordion-icon="" class="w-5 h-5 rotate-180 shrink-0" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="price-body" class="hidden" aria-labelledby="price-heading">
                                        <div class="flex items-center py-2 space-x-3 font-light border-b border-gray-200 dark:border-gray-600"><select id="price-from" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"><option disabled="" selected="">From</option><option>$500</option><option>$2500</option><option>$5000</option></select><select id="price-to" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"><option disabled="" selected="">To</option><option>$500</option><option>$2500</option><option>$5000</option></select></div>
                                    </div>
                                    <!-- Worldwide Shipping -->
                                    <h2 id="worldwide-shipping-heading">
                                        <button type="button" class="flex items-center justify-between w-full py-2 px-1.5 text-sm font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700" data-accordion-target="#worldwide-shipping-body" aria-expanded="true" aria-controls="worldwide-shipping-body">
                                            <span>Worldwide Shipping</span>
                                            <svg aria-hidden="true" data-accordion-icon="" class="w-5 h-5 rotate-180 shrink-0" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                            </svg>
                                        </button>
                                    </h2>
                                    <div id="worldwide-shipping-body" class="hidden" aria-labelledby="worldwide-shipping-heading">
                                        <div class="py-2 space-y-2 font-light border-b border-gray-200 dark:border-gray-600">
                                            <label class="relative flex items-center cursor-pointer">
                                                <input type="checkbox" value="" class="sr-only peer" name="shipping" checked="">
                                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">North America</span>
                                            </label>
                                            <label class="relative flex items-center cursor-pointer">
                                                <input type="checkbox" value="" class="sr-only peer" name="shipping">
                                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">South America</span>
                                            </label>
                                            <label class="relative flex items-center cursor-pointer">
                                                <input type="checkbox" value="" class="sr-only peer" name="shipping">
                                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Asia</span>
                                            </label>
                                            <label class="relative flex items-center cursor-pointer">
                                                <input type="checkbox" value="" class="sr-only peer" name="shipping" checked="">
                                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Australia</span>
                                            </label>
                                            <label class="relative flex items-center cursor-pointer">
                                                <input type="checkbox" value="" class="sr-only peer" name="shipping">
                                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                                                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Europe</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3 w-full md:w-auto">
                                <button id="actionsDropdownButton" data-dropdown-toggle="actionsDropdown" class="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                                    Actions
                                    <svg class="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path clip-rule="evenodd" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </button>
                                <div id="actionsDropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="actionsDropdownButton">
                                        <li>
                                            <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mass Edit</a>
                                        </li>
                                    </ul>
                                    <div class="py-1">
                                        <a href="#" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete all</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="inventory-section" class="overflow-x-auto">
                    ${html}
                    </div>
                    <div id="inventory_pagination">
                        ${paginator}
                    </div>
                </div>
            </div>
        </section>

        <!-- End block -->
        <div id="createProductModal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] md:h-full">
            <div class="relative p-4 w-full max-w-3xl h-full md:h-auto">
                <!-- Modal content -->
                <div class="relative p-4 overflow-y-auto h-[95vh] bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    <!-- Modal header -->
                    <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Product</h3>
                        <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="createProductModal">
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <form action="#">
                        <div class="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                                <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required="">
                            </div>
                            <div><label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label><select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"><option selected="">Select category</option><option value="TV">TV/Monitors</option><option value="PC">PC</option><option value="GA">Gaming/Console</option><option value="PH">Phones</option></select></div>
                            <div>
                                <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
                                <input type="text" name="brand" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Product brand" required="">
                            </div>
                            <div>
                                <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                <input type="number" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required="">
                            </div>
                            <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-4">
                                <div>
                                    <label for="weight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item weight (kg)</label>
                                    <input type="number" name="weight" id="weight" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="12" required="">
                                </div>
                                <div>
                                    <label for="length" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lenght (cm)</label>
                                    <input type="number" name="length" id="length" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="105" required="">
                                </div>
                                <div>
                                    <label for="breadth" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Breadth (cm)</label>
                                    <input type="number" name="breadth" id="breadth" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="15" required="">
                                </div>
                                <div>
                                    <label for="width" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Width (cm)</label>
                                    <input type="number" name="width" id="width" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="23" required="">
                                </div>
                            </div>
                            <div class="sm:col-span-2"><label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label><textarea id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write product description here"></textarea></div>
                        </div>
                        <div class="mb-4 space-y-4 sm:flex sm:space-y-0">
                            <div class="flex items-center mr-4">
                                <input id="inline-checkbox" type="checkbox" value="" name="sellingType" class="w-4 h-4 bg-gray-100 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <label for="inline-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">In-store only</label>
                            </div>
                            <div class="flex items-center mr-4">
                                <input id="inline-2-checkbox" type="checkbox" value="" name="sellingType" class="w-4 h-4 bg-gray-100 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <label for="inline-2-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Online selling only</label>
                            </div>
                            <div class="flex items-center mr-4">
                                <input checked="" id="inline-checked-checkbox" type="checkbox" value="" name="sellingType" class="w-4 h-4 bg-gray-100 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <label for="inline-checked-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Both in-store and online</label>
                            </div>
                        </div>
                        <div class="mb-4">
                            <span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Images</span>
                            <div class="flex justify-center items-center w-full">
                                <label for="dropzone-file" class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div class="flex flex-col justify-center items-center pt-5 pb-6">
                                        <svg aria-hidden="true" class="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="font-semibold">Click to upload</span>
                                            or drag and drop
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                    </div>
                                    <input id="dropzone-file" type="file" class="hidden">
                                </label>
                            </div>
                        </div>
                        <div class="items-center justify-evenly space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                            <button type="submit" class="w-full sm:w-auto justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                Add product
                            </button>
                            <button data-modal-toggle="createProductModal" type="button" class="w-full justify-center sm:w-auto text-gray-500 inline-flex items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                                <svg class="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                                Discard
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"></script>
        `;
}

// TODO: re route an inventory detail request to the profile page
window.InventoryPage = InventoryPage;
