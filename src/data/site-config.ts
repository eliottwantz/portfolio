export type Image = {
    src: string;
    alt: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title: string;
    text: string;
    actions: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    header: {
        image: Image;
    };
    hero: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Eliott Wantz',
    subtitle: 'Software Engineer',
    description: "Eliott Wantz's personal website.",
    image: {
        src: '/site-preview.png',
        alt: 'Eliott Wantz Portfolio'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Work',
            href: '/work'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'About',
            href: '/about'
        },
        // {
        //     text: 'Blog',
        //     href: '/blog'
        // },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Terms',
            href: '/terms'
        }
    ],
    socialLinks: [
        {
            text: 'Github',
            href: 'https://github.com/eliottwantz'
        },
        {
            text: 'Linkedin',
            href: 'https://www.linkedin.com/in/eliott-sw/'
        }
    ],
    header: {
        image: {
            src: '/pp.jpg',
            alt: 'Eliott Wantz',
            caption: 'Photo by Eliott Wantz'
        }
    },
    hero: {
        title: 'Welcome to my website!',
        text: "I'm **Eliott Wantz**, a software engineer, who loves to build amazing things. I'm always looking for new and exciting projects to work on. Whenever I have a new idea, I immediately start working on it. I am precise, organized, and adaptable. I have vast experience in both front and back-end development. My approach involves creating solutions that are both efficient and user-friendly. In a team environment, I like to listen to others' ideas and give my personal opinion to challenge the different points of views. I take ownership and responsibility.\n\nI'm always looking for new and exciting projects to work on. If you are interested in working with me or you'd like to know more about me, feel free to contact me.",

        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        title: 'Subscribe to my Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
