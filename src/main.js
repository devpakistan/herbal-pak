const moneyFormatter = (currency) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  });

const app = document.querySelector('#app');

async function loadProduct() {
  const response = await fetch('/content/product.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Unable to load product data.');
  }
  return response.json();
}

function render(product) {
  const money = moneyFormatter(product.currency);
  const enabledVariants = (product.variants || []).filter((variant) => variant.enabled !== false);
  const enabledOptions = (product.options || []).filter((option) => option.enabled !== false && Array.isArray(option.values) && option.values.length);

  app.innerHTML = `
    <main class="min-h-screen">
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,143,69,0.15),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(217,164,65,0.18),_transparent_30%)]"></div>
        <div class="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-16">
          <div class="space-y-8">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-brand-700 shadow-sm">
              <span class="h-2 w-2 rounded-full bg-brand-500"></span>
              ${product.badge}
            </div>
            <div class="max-w-3xl space-y-5">
              <h1 class="text-4xl font-black tracking-tight text-brand-900 sm:text-5xl lg:text-6xl">${product.title}</h1>
              <p class="text-lg leading-8 text-slate-700">${product.subtitle}</p>
            </div>
            <div class="grid gap-4 sm:grid-cols-3">
              ${(product.highlights || [])
                .map(
                  (item) => `
                    <div class="rounded-3xl border border-brand-100 bg-white p-5 shadow-soft">
                      <p class="text-sm font-semibold uppercase tracking-wide text-brand-600">${item.label}</p>
                      <p class="mt-2 text-sm leading-6 text-slate-600">${item.text}</p>
                    </div>
                  `,
                )
                .join('')}
            </div>
          </div>

          <aside class="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-soft">
            <div class="rounded-[1.5rem] bg-brand-50 p-6">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Cash on delivery</p>
              <p class="mt-2 text-3xl font-black text-brand-900">${money.format(product.price)}</p>
              <p class="mt-2 text-sm text-slate-600">${product.deliveryNote}</p>
            </div>

            <div class="mt-6 space-y-3">
              <button id="add-to-cart" class="w-full rounded-2xl bg-brand-600 px-5 py-4 text-base font-semibold text-white transition hover:bg-brand-700">Add to cart</button>
              <button id="save-product" class="w-full rounded-2xl border border-brand-200 bg-white px-5 py-4 text-base font-semibold text-brand-700 transition hover:border-brand-500">Save product</button>
              <button id="buy-cod" class="w-full rounded-2xl bg-accent px-5 py-4 text-base font-semibold text-white transition hover:opacity-95">Buy with COD</button>
            </div>

            <div class="mt-6 rounded-2xl border border-dashed border-brand-200 p-4 text-sm text-slate-600">
              <p class="font-semibold text-brand-900">How it works</p>
              <ol class="mt-2 list-decimal space-y-1 pl-5">
                ${product.orderSteps.map((step) => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div class="space-y-6">
            <section class="rounded-[2rem] bg-white p-6 shadow-soft">
              <h2 class="text-2xl font-bold text-brand-900">Why people choose it</h2>
              <div class="mt-5 space-y-4">
                ${(product.benefits || [])
                  .map(
                    (benefit) => `
                      <div class="rounded-2xl bg-brand-50 p-4">
                        <p class="font-semibold text-brand-900">${benefit.title}</p>
                        <p class="mt-1 text-sm leading-6 text-slate-600">${benefit.description}</p>
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            </section>

            <section class="rounded-[2rem] bg-white p-6 shadow-soft">
              <h2 class="text-2xl font-bold text-brand-900">Ingredients</h2>
              <div class="mt-4 flex flex-wrap gap-3">
                ${(product.ingredients || [])
                  .map((ingredient) => `<span class="rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-800">${ingredient}</span>`)
                  .join('')}
              </div>
            </section>

            <section class="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
              <h2 class="text-xl font-bold text-amber-900">Important note</h2>
              <p class="mt-2 text-sm leading-6 text-amber-950/80">${product.disclaimer}</p>
            </section>
          </div>

          <div class="space-y-6">
            <section class="rounded-[2rem] bg-white p-6 shadow-soft">
              <div class="flex items-center justify-between gap-4">
                <h2 class="text-2xl font-bold text-brand-900">Choose your package</h2>
                <span class="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">Optional settings only</span>
              </div>
              <div class="mt-5 grid gap-4">
                ${
                  enabledVariants.length
                    ? enabledVariants
                        .map(
                          (variant, index) => `
                            <button class="variant-card text-left rounded-2xl border border-brand-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-500 ${index === 0 ? 'ring-2 ring-brand-500' : ''}" data-variant="${variant.label}">
                              <div class="flex items-start justify-between gap-4">
                                <div>
                                  <p class="font-semibold text-brand-900">${variant.label}</p>
                                  <p class="mt-1 text-sm text-slate-600">${variant.description}</p>
                                </div>
                                <span class="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">${money.format(variant.price)}</span>
                              </div>
                            </button>
                          `,
                        )
                        .join('')
                    : '<p class="text-sm text-slate-500">No package options are currently enabled.</p>'
                }
              </div>
            </section>

            <section class="space-y-4">
              ${
                enabledOptions.length
                  ? enabledOptions
                      .map(
                        (option) => `
                          <section class="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm">
                            <div class="flex items-center justify-between gap-4">
                              <div>
                                <h3 class="text-base font-semibold text-brand-900">${option.label}</h3>
                                <p class="mt-1 text-sm text-slate-600">${option.helpText || ''}</p>
                              </div>
                              <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">Optional</span>
                            </div>
                            <div class="mt-4 grid gap-3 sm:grid-cols-2">
                              ${option.values
                                .map(
                                  (value) => `
                                    <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-500">
                                      <input type="${option.type === 'checkbox' ? 'checkbox' : 'radio'}" name="${option.key}" value="${value}" class="mt-1 accent-brand-600" />
                                      <span class="text-sm font-medium text-slate-700">${value}</span>
                                    </label>
                                  `,
                                )
                                .join('')}
                            </div>
                          </section>
                        `,
                      )
                      .join('')
                  : '<div class="rounded-[2rem] bg-white p-6 shadow-soft text-sm text-slate-500">No extra options are enabled in Decap CMS.</div>'
              }
            </section>
          </div>
        </div>
      </section>
    </main>
  `;

  let selectedVariant = enabledVariants[0]?.label || product.title;
  document.querySelectorAll('.variant-card').forEach((button) => {
    button.addEventListener('click', () => {
      selectedVariant = button.getAttribute('data-variant');
      document.querySelectorAll('.variant-card').forEach((card) => card.classList.remove('ring-2', 'ring-brand-500'));
      button.classList.add('ring-2', 'ring-brand-500');
    });
  });

  const updateStatus = (message) => {
    const existing = document.getElementById('purchase-status');
    const status = existing || document.createElement('p');
    status.id = 'purchase-status';
    status.className = 'mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800';
    status.textContent = message;
    document.querySelector('aside').appendChild(status);
  };

  document.getElementById('add-to-cart').addEventListener('click', () => {
    localStorage.setItem('herbal-pak-cart', JSON.stringify({ product: product.title, variant: selectedVariant }));
    updateStatus(`Added "${selectedVariant}" to cart.`);
  });

  document.getElementById('save-product').addEventListener('click', () => {
    localStorage.setItem('herbal-pak-saved-product', product.title);
    updateStatus('Product saved for later.');
  });

  document.getElementById('buy-cod').addEventListener('click', () => {
    updateStatus('Your COD order request is ready. Connect this button to your checkout form when needed.');
  });
}

loadProduct()
  .then(render)
  .catch((error) => {
    app.innerHTML = `
      <main class="mx-auto max-w-3xl px-4 py-16">
        <div class="rounded-3xl bg-white p-8 shadow-soft">
          <h1 class="text-2xl font-bold text-brand-900">Failed to load product data</h1>
          <p class="mt-3 text-slate-600">${error.message}</p>
        </div>
      </main>
    `;
  });
