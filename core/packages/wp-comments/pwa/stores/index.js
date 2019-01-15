import { types, getRoot, getEnv, flow } from 'mobx-state-tree';

const dateGmtRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/;
const normalizeDate = dateGmt => {
  const [, year, month, day, hours, minutes, seconds] = dateGmt.match(
    dateGmtRegex,
  );
  return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
};

const normalizeComment = ({
  id,
  author_name: name,
  author_avatar_urls: { '96': avatar },
  date: dateGmt,
  content: { rendered: content },
}) => ({
  id,
  name,
  content,
  avatar,
  date: dateGmt ? normalizeDate(dateGmt) : '',
});

export default types
  .model('WpComments', {})
  .views(self => ({
    get: ({ type, id }) => {
      const {
        _embedded: { replies },
      } = getRoot(self).connection.entity(type, id).raw;
      return replies ? replies[0].map(normalizeComment) : [];
    },
  }))
  .actions(self => ({
    create: flow(function* create({ id, name, email, url, content }) {
      const { api } = getEnv(self).connection.WpApi;
      // CODE BELOW IS NOT WORKING
      yield api.comments.create({
        author_name: name,
        author_email: email,
        author_url: url,
        post: id,
        content,
      });
    }),
  }));
