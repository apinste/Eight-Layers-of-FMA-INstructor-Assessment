// Results Calculation and Display

class ResultsManager {
    constructor(scores) {
        this.scores = scores;
        this.strengths = [];
        this.development = [];
        this.categorizeScores();
    }

    categorizeScores() {
        Object.entries(this.scores).forEach(([layerId, data]) => {
            if (data.score >= 4.0) {
                this.strengths.push({ layerId, ...data });
            } else if (data.score < 4.0) {
                this.development.push({ layerId, ...data });
            }
        });
        
        // Sort development areas by priority (lowest score first)
        this.development.sort((a, b) => a.score - b.score);
    }

    displayResults() {
        this.renderChart();
        this.renderCongratulations();
        this.renderStrengths();
        this.renderDevelopmentAreas();
        this.renderActionSteps();
    }

renderCongratulations() {
        // Calculate overall average score
        const overallAverage = Object.values(this.scores).reduce((sum, layer) => sum + layer.score, 0) / Object.keys(this.scores).length;
        
        // Determine message based on overall performance
        let message = '';
        let messageClass = '';
        
        if (overallAverage >= 4.0) {
            messageClass = 'excellence-message';
            message = `
                <h2>Strong Results</h2>
                <p><strong>Overall Score: ${overallAverage.toFixed(1)}/5.0</strong></p>
                <p>You demonstrate strong foundational competence across multiple layers of instructor development. Your commitment to principle-based teaching, safe training environments, and cultural stewardship shows through.</p>
                <p>Continue refining your practice, training with your mentor, and serving your students with care and consistency.</p>
            `;
        } else if (overallAverage >= 3.0) {
            messageClass = 'progress-message';
            message = `
                <h2>Solid Foundation</h2>
                <p><strong>Overall Score: ${overallAverage.toFixed(1)}/5.0</strong></p>
                <p>You've built a solid foundation across multiple areas of instructor development. Your honest self-assessment shows maturity and readiness to grow.</p>
                <p>Focus on your development priorities below and continue training with intention.</p>
            `;
        } else {
            messageClass = 'journey-message';
            message = `
                <h2>Development Roadmap Identified</h2>
                <p><strong>Overall Score: ${overallAverage.toFixed(1)}/5.0</strong></p>
                <p>Your development priorities are clear, and honest self-assessment is the first step toward growth.</p>
                <p>Focus on one layer at a time. Train with your mentor. Document your progress. Revisit this assessment in 6 months.</p>
            `;
        }
        
        // Insert message at the top of results (after the chart)
        const resultsContainer = document.querySelector('.results-summary');
        const messageDiv = document.createElement('div');
        messageDiv.className = `congratulations-message ${messageClass}`;
        messageDiv.innerHTML = message;
        
        // Insert after the chart
        resultsContainer.parentNode.insertBefore(messageDiv, resultsContainer.nextSibling);
    }

    renderChart() {
        const ctx = document.getElementById('results-chart').getContext('2d');
        
        const labels = Object.values(this.scores).map(s => s.name);
        const data = Object.values(this.scores).map(s => s.score);
        
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Your Score',
                    data: data,
                    backgroundColor: 'rgba(139, 0, 0, 0.2)',
                    borderColor: 'rgba(139, 0, 0, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(139, 0, 0, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(139, 0, 0, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderStrengths() {
        const container = document.getElementById('strengths-list');
        container.innerHTML = '';
        
        if (this.strengths.length === 0) {
            container.innerHTML = '<p>Continue building all foundational layers. Every area shows opportunity for growth.</p>';
            return;
        }
        
        this.strengths.forEach(strength => {
            const div = document.createElement('div');
            div.className = 'layer-result strength';
            div.innerHTML = `
                <h3>Layer ${strength.layerId}: ${strength.name}</h3>
                <p class="layer-score">Score: ${strength.score.toFixed(1)}/5.0</p>
                <p>${strength.description}</p>
            `;
            container.appendChild(div);
        });
    }

    renderDevelopmentAreas() {
        const container = document.getElementById('development-list');
        container.innerHTML = '';
        
        if (this.development.length === 0) {
            document.getElementById('development-section').style.display = 'none';
            return;
        }
        
        this.development.forEach((area, index) => {
            const div = document.createElement('div');
            div.className = 'layer-result development';
            
            let priority = '';
            if (index === 0) priority = ' - <strong>Priority 1</strong>';
            else if (index === 1) priority = ' - <strong>Priority 2</strong>';
            else if (index === 2) priority = ' - <strong>Priority 3</strong>';
            
            div.innerHTML = `
                <h3>Layer ${area.layerId}: ${area.name}${priority}</h3>
                <p class="layer-score">Score: ${area.score.toFixed(1)}/5.0</p>
                <p>${area.description}</p>
            `;
            container.appendChild(div);
        });
    }

    renderActionSteps() {
        const container = document.getElementById('action-steps-container');
        container.innerHTML = '';
        
        // Show action steps for top 3 development priorities
        const priorities = this.development.slice(0, 3);
        
        priorities.forEach((area, index) => {
            const actionPlan = this.getActionPlan(area.layerId);
            
            const section = document.createElement('div');
            section.className = 'priority-section';
            section.innerHTML = `
                <h3>Priority ${index + 1}: ${area.name} (${area.score.toFixed(1)}/5.0)</h3>
                ${actionPlan.context}
                <h4>Action Steps:</h4>
                <ol>
                    ${actionPlan.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
                ${actionPlan.resources ? `
                    <h4>Resources:</h4>
                    <ul>
                        ${actionPlan.resources.map(resource => `<li>${resource}</li>`).join('')}
                    </ul>
                ` : ''}
                <p class="timeline"><strong>Expected Timeline:</strong> ${actionPlan.timeline}</p>
            `;
            container.appendChild(section);
        });
        
        if (priorities.length === 0) {
            container.innerHTML = '<p>Great work! Focus on maintaining your strengths and continuing to refine all areas.</p>';
        }
    }

    getActionPlan(layerId) {
        const actionPlans = {
            1: {
                context: '<p>Technical credibility is the foundation of everything. Without it, students won\'t trust your instruction. Movement quality must be earned through deliberate practice, not just accumulated mat time.</p>',
                steps: [
                    '<strong>Film yourself weekly</strong> - Record solo training and analyze structure, timing, and tactical principles across all weapon categories (single stick, double stick, knife, espada y daga, panuntukan, dumog)',
                    '<strong>Practice slow-work to refine mechanics</strong> - Isolate one variable per session (structure, timing, or pressure)',
                    '<strong>Train regularly with your mentor</strong> - Schedule consistent training sessions (not just teaching). Student instructors and advanced practitioners need ongoing correction and refinement',
                    '<strong>Go back to fundamentals when needed</strong> - If strikes lack power, return to basic mechanics, conditioning drills, and tire training',
                    '<strong>Study biomechanics and kinetics</strong> - Understand how power transfers from feet → hips → shoulders → weapon across all ranges (long, medium, close, grappling)',
                    '<strong>Cross-check movement against tactical principles</strong> - Ask "does this follow sound combat logic?" for every technique across all weapon platforms',
                    '<strong>Increase deliberate practice reps</strong> - Quality over quantity; train with intention, not just repetition'
                ],
                resources: [
                    'Study footwork fundamentals and kinetic chain principles',
                    'Analyze combat biomechanics and power generation',
                    'Cross-train: observe how other combat sports generate and transfer power',
                    'Review recordings of senior practitioners and compare movement quality across weapon categories'
                ],
                timeline: '3-6 months to see measurable improvement in structure and timing'
            },
            2: {
                context: '<p>Teaching is a separate skill from doing. You can execute perfectly but fail to transmit knowledge if you can\'t diagnose errors, communicate clearly, teach principles (not just techniques), or create psychologically safe learning environments.</p>',
                steps: [
                    '<strong>Teach WHY, not just HOW</strong> - Help students understand tactical principles, geometry, and biomechanics behind techniques',
                    '<strong>Use the explain → demo → drill → correct → refine cycle</strong> - Structure every lesson with this progression',
                    '<strong>Keep corrections to one sentence</strong> - "Elbow stays inside your centerline" instead of long explanations',
                    '<strong>Practice 5-minute micro-lessons</strong> - Record yourself teaching a single drill and review for clarity',
                    '<strong>Document teaching case notes</strong> - What error did you observe? What correction did you apply? Did it work?',
                    '<strong>Create psychologically safe environments</strong> - Students should feel comfortable making mistakes and asking questions without fear',
                    '<strong>Train with your mentor on teaching methodology</strong> - Get feedback on how you explain, demonstrate, and correct students'
                ],
                resources: [
                    'Keep a teaching journal with case notes',
                    'Observe skilled instructors and take notes on their teaching methods',
                    'Study pedagogy: "The Inner Game of Tennis" by Timothy Gallwey',
                    'Practice giving corrections during sparring or flow drills'
                ],
                timeline: '2-4 months to see improvement in student comprehension and retention'
            },
            3: {
                context: '<p>Students need instructors who are steady, humble, and focused on their growth. Emotional maturity creates psychological safety and trust. Reject fear-based, pain-based, or "break them down to build them up" mentalities - they\'re outdated and harmful.</p>',
                steps: [
                    '<strong>Reject fear-based and pain-based training methods</strong> - Use science-backed conditioning and safe training protocols',
                    '<strong>Write "What went well / What needs work" after each class</strong> - Build the habit of reflective practice',
                    '<strong>Accept feedback without defensiveness</strong> - When corrected, say "thank you" and apply it immediately',
                    '<strong>Practice emotional regulation</strong> - Notice when you feel reactive or defensive, and pause before responding',
                    '<strong>Admit mistakes openly</strong> - Model humility by acknowledging when you\'re wrong or don\'t know something',
                    '<strong>Prioritize student growth over ego</strong> - Ask yourself: "Is this about helping them or proving myself?"',
                    '<strong>Seek mentorship on professional conduct</strong> - Ask your mentor or senior practitioners how to handle difficult situations with grace'
                ],
                resources: [
                    'Study modern sports science and safe conditioning practices',
                    'Consider working with a therapist, coach, or mentor',
                    'Practice mindfulness or meditation to improve self-awareness',
                    'Read: "Ego is the Enemy" by Ryan Holiday'
                ],
                timeline: 'Ongoing - maturity is a lifelong practice that deepens with experience'
            },
            4: {
                context: '<p>Retention problems often stem from misalignment. When students don\'t know what they\'re signing up for, they leave confused. FMA offers more than techniques - it offers self-defense, tactical thinking, cultural connection, martial art forms and concepts, and physical development.</p>',
                steps: [
                    '<strong>Articulate what FMA offers beyond techniques</strong> - Self-defense, tactical thinking, cultural connection, physical development, martial art mastery',
                    '<strong>Write your training philosophy</strong> - Emphasize respect, science, community, and principle-based learning (not fear or dominance)',
                    '<strong>Study Philippine history and culture</strong> - Understand the cultural context that shaped FMA. Read about pre-colonial Philippines, resistance movements, and warrior traditions',
                    '<strong>Learn about common Filipino values</strong> - Study values like <em>kapwa</em> (shared identity), <em>bayanihan</em> (communal unity), <em>utang na loob</em> (reciprocal gratitude), <em>pakikisama</em> (harmonious relations), <em>hiya</em> (sense of propriety). Understand how these values shape community and relationships.',
                    '<strong>Pre-screen new students</strong> - Have a conversation before they join to assess goal alignment',
                    '<strong>Communicate values regularly</strong> - Remind students what the program stands for (not just techniques)'
                ],
                resources: [
                    'Study your lineage\'s history and philosophy',
                    'Read Philippine history books and cultural studies',
                    'Attend Filipino cultural events, festivals, or FMA retreats focused on cultural transmission',
                    'If travel to the Philippines isn\'t possible, attend cultural gatherings or seminars locally'
                ],
                timeline: '1-2 weeks to clarify mission, ongoing to deepen cultural understanding'
            },
            5: {
                context: '<p>Students need to know where they are and where they\'re going. Teach progressively from foundational principles to advanced application - not just random techniques. Combine clear curriculum with reliable operations and documented safety protocols.</p>',
                steps: [
                    '<strong>Build principle-based curriculum</strong> - Teach progressively from foundational principles to advanced application (not random techniques)',
                    '<strong>Document progression across weapon platforms</strong> - Show clear path from stick → knife → sword → empty hand and across tactical ranges',
                    '<strong>Create documented safety protocols</strong> - Especially for sparring, contact drills, and weapon training',
                    '<strong>Define milestones that measure principle understanding</strong> - Not just technique memorization',
                    '<strong>Track attendance and follow up</strong> - Reach out after 2+ missed sessions to check in',
                    '<strong>Systemize operations</strong> - Consistent class times, clear communication channels, payment systems that work',
                    '<strong>Work with your mentor to refine curriculum delivery</strong> - Get feedback on pacing, structure, and progression logic'
                ],
                resources: [
                    'FMA curriculum design templates',
                    'Safety protocol checklists for weapon training',
                    'Student progress tracking spreadsheets',
                    'Class communication protocols (WhatsApp, Discord, email)'
                ],
                timeline: '3-4 weeks to establish systems, ongoing to maintain and refine'
            },
            6: {
                context: '<p>Students stay when they feel they belong. Community is built through intentional stewardship, respect, and social skills - not just training together. Lineage culture is transmitted through modeling, not just talking about it.</p>',
                steps: [
                    '<strong>Prioritize social skills and respectful communication</strong> - Create a culture where people support each other, not compete destructively',
                    '<strong>Support peers during training</strong> - Help newer students, encourage struggling students, celebrate progress',
                    '<strong>Model humility and respect</strong> - Demonstrate the values you teach in how you conduct yourself',
                    '<strong>Facilitate community-building</strong> - Post-class gatherings, group challenges, seminars, demonstrations',
                    '<strong>Teach cultural context in classes</strong> - Share history, philosophy, and Filipino values (not just techniques)',
                    '<strong>Encourage peer mentorship</strong> - Pair senior students with newer ones',
                    '<strong>Attend cultural events and retreats</strong> - Participate in Filipino cultural gatherings, FMA events, or lineage-focused seminars'
                ],
                resources: [
                    'Community-building activity ideas for martial arts schools',
                    'Senior student mentorship structure templates',
                    'Lineage history and cultural resources',
                    'Filipino cultural organizations and FMA community events'
                ],
                timeline: '1-3 months to establish culture, ongoing to maintain and deepen'
            },
            7: {
                context: '<p>Not all students are meant to stay long-term. Understanding their goals (self-defense, fitness, cultural connection, mastery) helps you serve them better. Address misalignment with compassion - not shame, guilt, or intimidation.</p>',
                steps: [
                    '<strong>Have goal-setting conversations</strong> - Ask students what they want (self-defense? fitness? mastery? cultural connection? tactics?)',
                    '<strong>Assess commitment levels</strong> - Understand who\'s here for life vs. trying it out vs. here for a season',
                    '<strong>Encourage self-accountability</strong> - Students should track their own progress, set personal goals, and take ownership',
                    '<strong>Address misalignment with compassion</strong> - If someone isn\'t thriving, have an honest conversation without shame or intimidation',
                    '<strong>Let go gracefully</strong> - Some students will leave, and that\'s natural. Don\'t guilt or pressure them to stay',
                    '<strong>Cultivate practitioners who value respect, curiosity, and community</strong> - Not just toughness or aggression',
                    '<strong>Train with your mentor to understand student psychology</strong> - Learn how to identify readiness, commitment, and alignment'
                ],
                resources: [
                    'Student goal-setting worksheet',
                    'New student intake questions to assess alignment',
                    'Commitment level assessment framework',
                    'Scripts for compassionate conversations about misalignment'
                ],
                timeline: '1-2 months to implement, ongoing practice and refinement'
            },
            8: {
                context: '<p>Leadership isn\'t something you claim - it\'s recognized by students when you embody competence, care, and consistency across all layers. Students should respect you because of your consistency and competence - not because of fear or dominance.</p>',
                steps: [
                    '<strong>Lead by example in all aspects</strong> - Movement quality, teaching clarity, professionalism, humility, continuous learning',
                    '<strong>View leadership as stewardship and service</strong> - Not authority, control, or dominance',
                    '<strong>Continue training with your mentor regularly</strong> - Even advanced instructors need ongoing refinement and guidance',
                    '<strong>Build respect through consistency and competence</strong> - Not through fear, intimidation, or dominance',
                    '<strong>Model continuous improvement</strong> - Let students see you training, learning, and refining your craft',
                    '<strong>Mentor others in reflective practice</strong> - Help newer instructors develop self-awareness and teaching skill',
                    '<strong>Strengthen all foundational layers</strong> - Leadership emerges when all eight layers are strong'
                ],
                resources: [
                    'Re-take this assessment in 6 months to track your growth',
                    'Study examples of servant leadership in FMA lineages',
                    'Seek mentorship from senior practitioners',
                    'Contribute to your lineage or FMA community through teaching, writing, organizing, or cultural preservation'
                ],
                timeline: 'Ongoing - leadership is the outcome of sustained excellence across all layers'
            }
        };
        
        return actionPlans[layerId] || {
            context: '<p>Focus on building this foundational layer.</p>',
            steps: ['Revisit the questions in this section and identify specific areas to develop'],
            timeline: 'Ongoing'
        };
    }
}
