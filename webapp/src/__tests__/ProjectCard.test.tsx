import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Project } from '../types/project';

const mockProject: Project = {
  id: 'test-1',
  title: 'Test Project',
  description: 'A test project description for rendering checks.',
  imageUrl: 'https://example.com/image.jpg',
  region: '06',
  category: 'Environnement',
  fundingGoal: 10000,
  fundingCurrent: 3500,
  createdAt: '2025-01-15',
  author: 'Test Author',
  tags: ['test', 'env'],
};

const noop = () => {};

describe('ProjectCard — image rendering', () => {
  it('renders the background image with the correct URL', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={5}
      />,
    );
    const imageDiv = container.querySelector('.projectCardImage') as HTMLElement;
    expect(imageDiv).toBeTruthy();
    expect(imageDiv.style.backgroundImage).toContain('https://example.com/image.jpg');
  });

  it('renders the gradient overlay', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={3}
      />,
    );
    const overlay = container.querySelector('.projectCardOverlay');
    expect(overlay).toBeTruthy();
  });

  it('renders the project title and description', () => {
    render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    expect(screen.getByText('Test Project')).toBeTruthy();
    expect(screen.getByText('A test project description for rendering checks.')).toBeTruthy();
  });

  it('renders funding progress bar with correct width', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const fill = container.querySelector('.projectCardProgressFill') as HTMLElement;
    expect(fill).toBeTruthy();
    // 3500 / 10000 = 35%
    expect(fill.style.width).toBe('35%');
  });

  it('caps the progress bar at 100% when overfunded', () => {
    const overfunded = { ...mockProject, fundingCurrent: 15000 };
    const { container } = render(
      <ProjectCard
        project={overfunded}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const fill = container.querySelector('.projectCardProgressFill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('shows the counter badge when total > 1', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={2}
        total={5}
      />,
    );
    const counter = container.querySelector('.projectCardCounter');
    expect(counter).toBeTruthy();
    expect(counter!.textContent).toBe('3/5');
  });

  it('hides the counter badge when total is 1', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const counter = container.querySelector('.projectCardCounter');
    expect(counter).toBeNull();
  });

  it('shows swipe hint when showSwipeHint is true', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={5}
        showSwipeHint
      />,
    );
    const hint = container.querySelector('.projectCardSwipeHint');
    expect(hint).toBeTruthy();
  });

  it('hides swipe hint when showSwipeHint is false', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={5}
        showSwipeHint={false}
      />,
    );
    const hint = container.querySelector('.projectCardSwipeHint');
    expect(hint).toBeNull();
  });
});

describe('ProjectCard — follow button', () => {
  it('renders the heart button with projectCardHeart class', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const heartBtn = container.querySelector('.projectCardHeart') as HTMLElement;
    expect(heartBtn).toBeTruthy();
    expect(heartBtn.tagName).toBe('BUTTON');
  });

  it('does NOT have active class when not followed', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const heartBtn = container.querySelector('.projectCardHeart') as HTMLElement;
    expect(heartBtn.classList.contains('projectCardHeartActive')).toBe(false);
  });

  it('has active class when followed', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={true}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const heartBtn = container.querySelector('.projectCardHeart') as HTMLElement;
    expect(heartBtn.classList.contains('projectCardHeartActive')).toBe(true);
  });

  it('renders heart SVG with currentColor stroke when not followed', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const svg = container.querySelector('.projectCardHeart svg') as SVGElement;
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('stroke')).toBe('currentColor');
  });

  it('renders heart SVG with red stroke and fill when followed', () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={true}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const svg = container.querySelector('.projectCardHeart svg') as SVGElement;
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('stroke')).toBe('#e62f44');
    expect(svg.getAttribute('fill')).toBe('#e62f44');
  });

  it('calls onFollow when heart button is clicked', () => {
    const onFollow = jest.fn();
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={onFollow}
        onDoubleTap={noop}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const heartBtn = container.querySelector('.projectCardHeart') as HTMLElement;
    fireEvent.click(heartBtn);
    expect(onFollow).toHaveBeenCalledTimes(1);
  });

  it('heart click does not trigger card double-tap', () => {
    const onDoubleTap = jest.fn();
    const onFollow = jest.fn();
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={onFollow}
        onDoubleTap={onDoubleTap}
        onDetails={noop}
        index={0}
        total={1}
      />,
    );
    const heartBtn = container.querySelector('.projectCardHeart') as HTMLElement;
    fireEvent.click(heartBtn);
    fireEvent.click(heartBtn);
    expect(onFollow).toHaveBeenCalledTimes(2);
    expect(onDoubleTap).not.toHaveBeenCalled();
  });

  it('details button calls onDetails when clicked', () => {
    const onDetails = jest.fn();
    const { container } = render(
      <ProjectCard
        project={mockProject}
        isFollowed={false}
        onFollow={noop}
        onDoubleTap={noop}
        onDetails={onDetails}
        index={0}
        total={1}
      />,
    );
    const detailsBtn = container.querySelector('.projectCardDetails') as HTMLElement;
    fireEvent.click(detailsBtn);
    expect(onDetails).toHaveBeenCalledTimes(1);
  });
});
