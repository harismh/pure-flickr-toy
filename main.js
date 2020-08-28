const cdn = (libPath) => `https://cdnjs.cloudflare.com/ajax/libs/${libPath}`;
const ramda = cdn("ramda/0.21.0/ramda.min");
const jquery = cdn("jquery/3.0.0-rc1/jquery.min");

requirejs.config({ paths: { ramda, jquery } });
requirejs(["jquery", "ramda"], ($, { compose, curry, map, prop }) => {
  const Impure = {
    trace: curry((tag, x) => {
      console.log({ [tag]: x });
      return x;
    }),
    getJson: curry((callback, url) => $.getJSON(url, callback)),
    setHtml: curry((selector, html) => $(selector).html(html))
  };

  const Client = {
    host: "api.flickr.com",
    path: "/services/feeds/photos_public.gne",
    query: (tag) => `?tags=${tag}&format=json&jsoncallback=?`,
    url: (tag) => `https://${Client.host}${Client.path}${Client.query(tag)}`
  };

  const img = (src) => $("<img />", { src });
  const mediaUrl = compose(prop("m"), prop("media"));
  const mediaToImg = compose(img, mediaUrl);
  const images = compose(map(mediaToImg), prop("items"));

  /************ Render ************/

  const render = compose(Impure.setHtml("#main"), images);
  const app = compose(Impure.getJson(render), Client.url);
  const search = curry((query) => app(query));

  search("cats");
});
