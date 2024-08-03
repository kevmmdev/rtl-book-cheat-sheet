import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RepositoriesListItem from './RepositoriesListItem';

function renderComponent() {
  const repository = {
    full_name: 'facebook/react',
    language: 'Javascript',
    description: 'A js library',
    owner: 'facebook',
    name: 'react',
    html_url: 'https://github.com/facebook/react',
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );

  return { repository };
}

test('shows a link to the github homepage for this repository', async () => {
  const { repository } = renderComponent();

  await screen.findByRole('img', { name: 'Javascript' });

  const link = screen.getByRole('link', {
    name: /github repository/i,
  });
  expect(link).toHaveAttribute('href', repository.html_url);
});
