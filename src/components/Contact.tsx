import React from 'react';
import { Mail, MessagesSquare } from 'lucide-react';

/**
 * Contact — the one place on the page that says how to reach a person.
 *
 * Email is the real support address. The Discord href currently points at
 * discord.com because the server invite link does not exist yet; it gets
 * swapped for the invite URL once the server is set up.
 */
export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold text-[var(--g)] mb-2">
            Contact
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--tx)] mb-4">
            Talk to a human.
          </h2>
          <p className="text-base md:text-lg text-[var(--mut)] leading-relaxed">
            Ownbench is a one-person shop. Email goes to the person who wrote the engine — no
            ticket queue, no bot — and the Discord is where early users compare notes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          <a
            href="mailto:support.openbench@gmail.com"
            className="bench-card p-5 hover:bg-[var(--bg)] transition-colors group"
          >
            <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] mb-2">
              <Mail className="w-3.5 h-3.5" />
              Email
            </span>
            <span className="font-display font-bold text-[var(--tx)] group-hover:text-[var(--g)] break-all">
              support.openbench@gmail.com
            </span>
            <span className="block text-xs text-[var(--mut)] mt-1.5 leading-relaxed">
              Questions, bugs, and Linux requests. Answered by a person.
            </span>
          </a>

          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bench-card p-5 hover:bg-[var(--bg)] transition-colors group"
          >
            <span className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[var(--mut)] mb-2">
              <MessagesSquare className="w-3.5 h-3.5" />
              Discord
            </span>
            <span className="font-display font-bold text-[var(--tx)] group-hover:text-[var(--g)]">
              Join the server
            </span>
            <span className="block text-xs text-[var(--mut)] mt-1.5 leading-relaxed">
              The invite link lands here as soon as the server opens — this button opens Discord.
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
