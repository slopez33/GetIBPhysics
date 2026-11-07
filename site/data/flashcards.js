/* Original vocabulary cards; topic codes follow the supplied IB Physics guide. */
(() => {
const cards=[];
const deck=(topic,lines)=>lines.trim().split('\n').forEach(line=>{const [term,definition,detail]=line.split('|').map(x=>x.trim());cards.push({id:'v'+String(cards.length+1).padStart(3,'0'),topic,term,definition,detail});});
deck('A.1',String.raw`
Position|The location of a body relative to a chosen origin and reference frame.|Changing the origin changes coordinates without changing the physical motion.
Distance|The total length of the path travelled by a body.|It is a scalar and is never negative.
Displacement|The change in position, including direction, between two events.|A complete lap has zero displacement although the distance is non-zero.
Average speed|Total distance travelled divided by total elapsed time.|Include all travel and stopping intervals in the specified journey.
Average velocity|Displacement divided by the elapsed time.|It can be zero even when an object has moved throughout the interval.
Instantaneous velocity|The rate of change of position at a particular instant.|It is the tangent gradient on a position-time graph.
Acceleration|The rate of change of velocity.|A direction change can produce acceleration with no change in speed.
Uniform acceleration|Acceleration that remains constant in magnitude and direction over the interval.|The standard four kinematic equations require this condition.
Free fall|Motion under gravity alone, with other forces negligible.|An upward-moving thrown object can be in free fall.
Projectile|A body launched and then moving under gravity, with resistance neglected in the ideal model.|Resolve motion horizontally and vertically using one common time.
Terminal speed|The constant falling speed reached when the resultant force becomes zero.|Weight is balanced by resistance and buoyancy, rather than disappearing.
Trajectory|The path followed by a moving body.|An ideal near-Earth projectile follows a parabola when air resistance is negligible.
`);
deck('A.2',String.raw`
Resultant force|The vector sum of all forces acting on a body.|Its direction sets the acceleration direction for constant mass.
Free-body diagram|A diagram showing the external forces acting on one chosen body.|Do not place both members of a third-law pair on the same body.
Inertia|The tendency of a body to maintain its velocity when no resultant force acts.|Mass quantifies resistance to a change in translational motion.
Normal force|The component of contact force perpendicular to the surface.|It need not equal the body's weight.
Static friction|A contact force opposing impending relative sliding between surfaces.|It adjusts from zero up to a limiting value.
Dynamic friction|A contact force opposing relative sliding of surfaces.|The syllabus model uses coefficient of dynamic friction times normal force.
Tension|A pulling force transmitted through a stretched string, rope or similar connector.|It acts along the connector and away from the body it pulls.
Buoyancy|The upward force on a body due to pressure differences in a fluid.|Its magnitude equals the weight of the displaced fluid.
Momentum|Mass multiplied by velocity, giving a vector quantity.|Conserve total system momentum when external impulse is negligible.
Impulse|The change in a body's momentum caused by a force over time.|It equals the signed area under a resultant-force-time graph.
Elastic collision|A collision in which total kinetic energy is conserved.|Momentum is also conserved if external impulse is negligible.
Centripetal acceleration|The inward acceleration required for motion along a circular path.|It changes direction even when the speed is constant.
`);
deck('A.3',String.raw`
Work|Energy transferred by a force acting through a displacement.|Only the force component along displacement contributes.
Kinetic energy|Energy associated with motion.|For non-relativistic translation it is one half mass times speed squared.
Gravitational potential energy|Energy of a system associated with relative positions in a gravitational field.|Near a surface its change is mass times g times height change.
Elastic potential energy|Energy stored when an elastic body is deformed.|A Hooke's-law spring stores one half spring constant times extension squared.
Mechanical energy|The sum of kinetic and relevant potential energies of a system.|It remains constant only when non-conservative transfers are absent.
Conservative force|A force whose work between two positions is independent of the path.|Gravity and ideal spring forces can be represented by potential-energy stores.
Dissipation|Transfer of organized mechanical energy into less useful forms, commonly internal energy.|Total energy is conserved even when mechanical energy decreases.
Power|The rate of doing work or transferring energy.|One watt is one joule per second.
Efficiency|Useful energy or power output divided by total corresponding input.|Multiply the dimensionless ratio by 100 to express a percentage.
Energy density of fuel|Energy available per unit mass of fuel.|Use energy per kilogram consistently when calculating required fuel mass.
Sankey diagram|A flow diagram whose arrow widths represent energy or power transfers.|Total output width equals input width for a complete account.
Work–energy theorem|The resultant work done on a body equals its change in kinetic energy.|Use the resultant force, rather than assuming each force changes only kinetic energy.
`);
deck('A.4',String.raw`
Rigid body|An ideal extended body whose shape and internal separations remain fixed.|Different points can have different linear speeds but one angular speed.
Torque|The turning effect of a force about a specified axis.|Use the perpendicular distance from axis to the force's line of action.
Lever arm|The perpendicular distance from the rotation axis to a force's line of action.|It is not necessarily the length of the physical handle.
Rotational equilibrium|A state with zero resultant external torque.|Angular velocity is constant; it need not be zero.
Angular displacement|The change in angular position about an axis.|Radians connect arc length and radius through angle equals arc length divided by radius.
Angular velocity|The rate of change of angular displacement.|For a rigid body all points share the same angular velocity about its axis.
Angular acceleration|The rate of change of angular velocity.|A non-zero resultant torque produces it for a fixed moment of inertia.
Moment of inertia|A measure of resistance to angular acceleration about a chosen axis.|Mass farther from the axis contributes more strongly because distance is squared.
Angular momentum|For the syllabus fixed-axis model, moment of inertia multiplied by angular velocity.|It is conserved when resultant external torque is zero.
Angular impulse|The change in angular momentum produced by a torque acting over time.|It is the signed area under a torque-time graph.
Rotational kinetic energy|Energy associated with a body's rotation about an axis.|For fixed-axis rotation it is one half moment of inertia times angular speed squared.
Rolling without slipping|Motion in which the contact point has no relative sliding against the surface.|On a stationary surface, the centre-of-mass speed equals radius times angular speed.
`);
deck('A.5',String.raw`
Reference frame|A coordinate system and clocks used by an observer to specify events.|Different frames can assign different space and time coordinates to one event.
Inertial frame|A non-accelerating frame in which Newton's first law holds.|A frame moving at constant velocity relative to an inertial frame is also inertial.
Event|An occurrence specified by a position and a time.|Relativity transforms complete event coordinates between frames.
Galilean transformation|The classical transformation relating coordinates in uniformly moving frames with universal time.|It is an excellent approximation when relative speeds are much smaller than c.
Lorentz factor|The factor that quantifies relativistic effects for a given relative speed.|It is at least one and grows as speed approaches c.
Proper time|The time interval measured in the frame where two events occur at the same position.|A clock carried between its own ticks measures proper time.
Time dilation|The longer interval measured between a moving clock's ticks compared with its proper interval.|Identify the events before deciding which frame measures proper time.
Proper length|The length of an object measured in its rest frame.|It is the largest inertial-frame length along the direction of relative motion.
Length contraction|The reduction in measured length of a moving object along its motion direction.|Endpoint positions must be recorded simultaneously in the measuring frame.
Relativity of simultaneity|Spatially separated events simultaneous in one inertial frame need not be simultaneous in another.|It follows from the Lorentz time transformation.
World line|The path representing an object's successive events on a spacetime diagram.|A stationary object has a vertical line on an x–ct diagram.
Spacetime interval|An invariant combination of time separation and spatial separation between two events.|In one dimension its square is $(c\Delta t)^2-(\Delta x)^2$.
`);
deck('B.1',String.raw`
Internal energy|The total random kinetic and intermolecular potential energy of a system's particles.|It is not the kinetic energy of the body's overall motion.
Temperature|A measure related to the average random kinetic energy of particles.|Equal temperature does not imply equal total internal energy.
Thermal equilibrium|A condition with no net thermal energy transfer between bodies in contact.|Microscopic exchange continues in both directions at equal rates.
Specific heat capacity|Energy required per unit mass for a unit temperature rise without a phase change.|Its SI unit is J kg⁻¹ K⁻¹.
Specific latent heat|Energy per unit mass transferred during a particular change of phase at constant temperature.|Fusion and vaporization have different values.
Conduction|Thermal energy transfer through microscopic interactions without bulk movement of matter.|In metals, mobile electrons make an important contribution.
Thermal conductivity|A material property measuring how readily it conducts thermal energy.|A larger value gives greater steady heat flow for the same geometry and gradient.
Convection|Thermal energy transfer by bulk fluid motion.|Density differences in a gravitational field often drive convection currents.
Thermal radiation|Energy transfer by electromagnetic waves emitted because of a body's temperature.|It can occur through a vacuum.
Black body|An ideal body that absorbs all incident radiation and is an ideal thermal emitter.|Its spectrum and total emission depend only on temperature.
Luminosity|The total radiant power emitted by a source.|It is measured in watts and differs from brightness at an observer.
Apparent brightness|The radiant power received per unit area at an observer.|For isotropic radiation without absorption it decreases with distance squared.
`);
deck('B.2',String.raw`
Solar constant|Solar power received per unit area normal to the rays at a specified orbital distance.|A planet's globally averaged incident flux is one quarter of this value.
Albedo|The fraction of incident radiant power scattered by a body or system.|Higher albedo reduces absorbed solar power if incident power is unchanged.
Emissivity|A surface's radiated power per area relative to a black body at the same temperature.|It is dimensionless and may depend on wavelength.
Radiative equilibrium|A condition in which absorbed and emitted radiative powers balance.|Energy continues flowing even though the average internal energy is constant.
Projected area|The area a body presents perpendicular to incoming rays.|A sphere intercepts sunlight over a disc of area πR².
Greenhouse effect|The warming influence of atmospheric infrared absorption and re-emission on a planetary surface.|Surface balance includes downward atmospheric radiation as well as absorbed sunlight.
Greenhouse gas|An atmospheric gas that absorbs and emits relevant infrared radiation.|Water vapour, carbon dioxide, methane and nitrous oxide are key examples.
Enhanced greenhouse effect|The increase in greenhouse warming due to human-driven changes in atmospheric composition.|Fossil-fuel combustion is a major source of additional carbon dioxide.
Infrared absorption|Transfer of infrared photon energy into allowed molecular energy changes.|Molecules absorb selected wavelengths rather than all wavelengths equally.
Molecular resonance|A model in which a molecule responds strongly near characteristic vibration frequencies.|It helps describe infrared interaction but is not a complete quantum account.
Energy imbalance|A difference between total incoming and outgoing power for a system.|A persistent positive imbalance increases the system's stored energy.
Ice–albedo feedback|The process in which changes in ice cover alter reflected sunlight and reinforce temperature change.|Melting lowers albedo and increases absorption in the simple positive-feedback picture.
`);
deck('B.3',String.raw`
Pressure|The normal force acting per unit area.|The pascal is one newton per square metre.
Ideal gas|A model of negligible-volume particles with no forces except during elastic collisions.|It best approximates real gases at low density and sufficiently high temperature.
Mole|The amount of substance containing Avogadro's number of specified particles.|Distinguish the amount n from particle number N.
Avogadro constant|The number of specified particles per mole.|It converts between particle counts and molar amounts.
Absolute temperature|Temperature measured from absolute zero on the Kelvin scale.|Use it in gas-law proportionalities, not Celsius temperature.
Boyle’s law|For a fixed amount of gas at constant temperature, pressure is inversely proportional to volume.|Its pressure-volume graph is a rectangular hyperbola.
Isobaric change|A thermodynamic change at constant pressure.|For a fixed ideal-gas amount, volume is proportional to absolute temperature.
Isochoric change|A thermodynamic change at constant volume.|It is also called isovolumetric; a fixed ideal gas has pressure proportional to temperature.
Isothermal change|A change at constant temperature.|A monatomic ideal gas has no internal-energy change during it.
Mean-square speed|The average of the squares of individual molecular speeds.|Its square root is rms speed, not mean speed.
Root-mean-square speed|The square root of mean-square molecular speed.|At a fixed temperature, lighter gas particles have greater rms speed.
Monatomic gas|A gas whose individual particles are single atoms.|The syllabus internal-energy relation has three translational degrees of freedom.
`);
deck('B.4',String.raw`
Closed system|A system that exchanges energy but not matter with its surroundings.|Heat and work can cross its boundary.
Isolated system|A system that exchanges neither matter nor energy with its surroundings.|Its total entropy cannot decrease.
First law of thermodynamics|Conservation of energy applied to thermal systems, relating heat, internal energy and work.|Use the booklet convention Q = ΔU + W, with W done by the system.
Adiabatic change|A thermodynamic change with no thermal energy transfer across the boundary.|Its temperature can still change because work changes internal energy.
Thermodynamic cycle|A sequence of processes returning the system to its initial state.|Internal-energy change over the full cycle is zero.
Heat engine|A cyclic device that absorbs heat, produces work and rejects heat to a colder reservoir.|Its net work is the heat input minus heat rejected.
Thermal reservoir|A large body treated as remaining at constant temperature while exchanging energy.|Its entropy change can be found from heat transfer divided by its fixed temperature.
Entropy|A thermodynamic state quantity related to energy dispersal and the number of accessible microstates.|Its SI unit is joules per kelvin.
Microstate|A particular microscopic arrangement consistent with a macroscopic state.|More accessible equally probable microstates correspond to greater entropy.
Reversible process|An ideal process that can be reversed without a net change to system and surroundings.|It produces no total entropy increase.
Irreversible process|A process that produces a positive total entropy change in an isolated overall system.|Real processes involving friction or finite-temperature heat flow are irreversible.
Carnot efficiency|The maximum heat-engine efficiency between specified hot and cold reservoirs.|Use absolute temperatures in $1-T_c/T_h$.
`);
deck('B.5',String.raw`
Electric current|The rate of flow of electric charge through a cross-section.|Conventional current is opposite to electron drift in a metal.
Potential difference|Energy transferred per unit charge between two points.|One volt corresponds to one joule per coulomb.
Electromotive force|Energy supplied per unit charge by an electrical source.|Despite its name, emf is measured in volts rather than newtons.
Resistance|The ratio of potential difference across a component to current through it.|A resistance value alone does not guarantee an ohmic component.
Resistivity|A material property relating wire resistance to its length and cross-sectional area.|Its SI unit is ohm metre.
Ohm’s law|Current is proportional to potential difference when physical conditions remain constant.|For a metal, maintaining constant temperature is essential.
Ohmic conductor|A conductor obeying Ohm's law over the stated range and conditions.|Its I–V graph is a straight line through the origin.
Internal resistance|The effective resistance within a source that dissipates energy as current flows.|It makes terminal voltage lower than emf during discharge.
Potential divider|A series-resistor arrangement that supplies a chosen fraction of an input voltage.|Output depends on which resistance is measured across and whether the divider is loaded.
Thermistor|A resistor whose resistance changes strongly with temperature.|A typical NTC thermistor's resistance decreases as temperature increases.
Light-dependent resistor|A component whose resistance depends on light intensity.|Its resistance generally decreases when illumination increases.
Potentiometer|A variable resistor arrangement with an adjustable contact for selecting potential difference.|It can provide a continuously variable voltage division.
`);
deck('C.1',String.raw`
Simple harmonic motion|Oscillation with acceleration proportional to displacement from equilibrium and directed toward equilibrium.|The defining equation contains a minus sign: $a=-\omega^2x$.
Equilibrium position|The position where the resultant restoring force is zero.|In ideal SHM, speed is greatest when the oscillator passes through it.
Amplitude|The maximum magnitude of displacement from equilibrium.|For a given ideal oscillator, total energy is proportional to amplitude squared.
Period|The time required for one complete oscillation.|Its SI unit is the second.
Frequency|The number of complete oscillations per unit time.|One hertz is one cycle per second.
Angular frequency|The rate of change of phase for a sinusoidal oscillation.|It equals 2π times frequency and is measured in radians per second.
Phase|The angular measure specifying a position within an oscillation cycle.|Two oscillators can have equal frequency but different phase.
Phase constant|The phase value at the chosen time origin in a sinusoidal model.|Use both initial displacement and direction to select it.
Restoring force|A force directed toward a stable equilibrium position.|A linear restoring force produces SHM for constant mass.
Simple pendulum|An ideal point mass on a light inextensible string swinging under gravity.|It approximates SHM only for small angular displacement.
Mass–spring oscillator|A system in which a mass oscillates under an approximately Hooke's-law restoring force.|Its ideal period grows with the square root of mass.
Isochronous oscillation|Oscillation whose period is independent of amplitude within the model's range.|Ideal SHM is isochronous; large-angle pendulum motion is not exactly so.
`);
deck('C.2',String.raw`
Travelling wave|A propagating disturbance that transfers energy from place to place.|The medium need not undergo net transport.
Mechanical wave|A wave transmitted through interactions within a material medium.|Sound cannot propagate through an ideal vacuum.
Electromagnetic wave|A propagating electric and magnetic field disturbance that can travel in vacuum.|All electromagnetic frequencies travel at c in vacuum.
Transverse wave|A wave with oscillations perpendicular to its propagation direction.|A transverse displacement graph does not show energy moving up and down with the particles.
Longitudinal wave|A wave with oscillations parallel to its propagation direction.|Sound in air has compressions and rarefactions.
Wavelength|The separation of adjacent points in phase on a wave.|Measure it from a displacement-position snapshot, not a time graph.
Wave speed|The propagation speed of a particular phase of a wave.|It equals frequency multiplied by wavelength.
Compression|A region of a longitudinal wave where particles are closer together than at equilibrium.|In sound it corresponds to above-average pressure.
Rarefaction|A region of a longitudinal wave where particles are farther apart than at equilibrium.|It alternates with compressions as the sound disturbance passes.
Intensity|The power carried by a wave per unit area perpendicular to propagation.|For comparable sinusoidal waves it is proportional to amplitude squared.
In phase|Having phase difference zero or an integer multiple of a full cycle.|Adjacent crests of a travelling wave are in phase.
Electromagnetic spectrum|The continuous range of electromagnetic radiation ordered by wavelength or frequency.|From radio to gamma rays, wavelength decreases and photon energy increases.
`);
deck('C.3',String.raw`
Wavefront|A line or surface joining points with the same wave phase.|Rays are perpendicular to wavefronts in the simple isotropic model.
Ray|A line showing the local direction of wave propagation.|Measure incidence and refraction angles between ray and normal.
Refraction|A change in wave propagation caused by entering a region with different wave speed.|Frequency stays fixed while wavelength changes.
Refractive index|For light, the ratio of vacuum light speed to speed in the medium.|A larger index means a smaller light speed.
Critical angle|The incidence angle in the higher-index medium giving a refracted angle of 90°.|Total internal reflection occurs for larger incidence angles.
Total internal reflection|Complete reflection at a boundary from higher to lower index when incidence exceeds the critical angle.|Both the index condition and angle condition are necessary.
Diffraction|Spreading of waves around obstacles or through apertures.|It is pronounced when wavelength and aperture size are comparable.
Superposition|The rule that resultant displacement is the algebraic sum of overlapping individual displacements.|It explains both constructive and destructive interference.
Coherence|A fixed phase relationship between waves of the same frequency.|It is required for a stable interference pattern.
Path difference|The difference in distances travelled by two waves reaching the same point.|For in-phase sources, integer wavelengths produce constructive interference.
Diffraction grating|A large number of equally spaced narrow slits or lines producing sharp interference maxima.|Convert line density into slit separation before using the grating equation.
Diffraction envelope|The broad single-slit intensity pattern modulating a multiple-slit interference pattern.|A narrow envelope can suppress some interference maxima.
`);
deck('C.4',String.raw`
Standing wave|A non-travelling pattern formed by superposing identical waves moving in opposite directions.|Its oscillation amplitude depends on position.
Node|A point of zero displacement amplitude in a standing wave.|Adjacent nodes are separated by half a wavelength.
Antinode|A point of maximum oscillation amplitude in a standing wave.|The nearest node is one quarter wavelength away.
First harmonic|The lowest-frequency allowed standing-wave mode for given boundary conditions.|Construct it by drawing the simplest pattern that satisfies both ends.
Harmonic|An allowed mode whose frequency is an integer multiple of the first harmonic frequency.|A one-closed-end pipe supports only odd harmonics in the ideal model.
Boundary condition|A constraint on motion at an end or interface that determines allowed wave patterns.|A fixed string end is a displacement node.
Natural frequency|A frequency at which a system oscillates freely after a disturbance.|A system may have several natural frequencies corresponding to different modes.
Driving frequency|The frequency of a periodic external force applied to a system.|The steady forced response occurs at this frequency.
Resonance|A large forced response when driving frequency is near a natural frequency.|Energy is transferred effectively over successive cycles.
Light damping|Energy loss small enough for oscillations to continue with decreasing amplitude.|A driven response usually has a high narrow resonance peak.
Critical damping|The fastest return to equilibrium without oscillation after displacement.|It lies at the boundary between oscillatory and non-oscillatory free responses.
Heavy damping|Damping greater than critical that prevents oscillation and gives a slower return to equilibrium.|It should not be confused with critical damping.
`);
deck('C.5',String.raw`
Doppler effect|A difference between emitted and observed frequency caused by relative source-observer motion.|Approach gives a higher observed frequency in the ordinary radial case.
Observed frequency|The rate at which wavefronts arrive at an observer.|It can differ from the source's oscillation frequency.
Emitted frequency|The oscillation frequency at the source.|It need not change when the source moves.
Redshift|A shift of a known spectral feature toward longer observed wavelength.|For low-speed radial Doppler motion it indicates recession.
Blueshift|A shift of a known spectral feature toward shorter observed wavelength.|For low-speed radial Doppler motion it indicates approach.
Radial velocity|The velocity component along the line between source and observer.|It is the component inferred from the ordinary low-speed spectral Doppler shift.
Rest wavelength|The wavelength of a spectral feature measured with source and observer mutually at rest.|Compare observed lines with this laboratory reference.
Fractional wavelength shift|The change in wavelength divided by its rest wavelength.|At low radial speeds its magnitude is approximately speed divided by c.
Moving-source effect|A Doppler shift caused by a source emitting successive wavefronts from different positions.|For sound, this changes wavelength in the medium ahead of and behind the source.
Moving-observer effect|A Doppler shift caused by an observer meeting wavefronts at a different rate.|For a stationary source in a stationary medium, the medium's wavelength is unchanged.
Ultrasound Doppler measurement|A method using frequency shifts of ultrasound to infer motion, such as blood flow.|Reflection can involve shifts on both parts of the round trip.
Spectral line shift|The displacement of an identified emission or absorption line from its rest position.|A pattern of lines helps separate motion from chemical identification.
`);
deck('D.1',String.raw`
Gravitational field|A description assigning the gravitational force per unit test mass to each position.|It allows interactions to be represented without placing a test body at every point.
Gravitational field strength|Gravitational force per unit mass at a point.|Its units N/kg are equivalent to acceleration units m/s².
Gravitational field line|A line whose tangent gives the direction of gravitational acceleration.|For an isolated spherical source, arrows point inward.
Inverse-square law|A relation in which magnitude decreases in proportion to the square of distance from a source.|Doubling centre-to-centre distance quarters the gravitational field.
Kepler’s first law|Planets move in elliptical orbits with the Sun at one focus.|Circular orbits are a special limiting case.
Kepler’s second law|A planet's radius vector sweeps equal areas in equal times.|Orbital speed is greater when closer to the central body.
Kepler’s third law|For bodies orbiting one central mass, period squared is proportional to semi-major axis cubed.|For circular orbits use orbital radius as the semi-major axis.
Gravitational potential|Gravitational potential energy per unit test mass, with zero conventionally at infinity.|It is negative near an isolated attractive mass.
Equipotential surface|A surface on which potential has the same value at all points.|Moving a mass along it changes no gravitational potential energy.
Potential gradient|The rate of change of potential with position.|Field points toward decreasing potential and equals the negative spatial gradient.
Escape speed|The minimum launch speed needed to reach infinity with no residual speed in the ideal model.|It neglects atmosphere, propulsion after launch and other gravitating bodies.
Orbital speed|The speed needed for a specified orbit under gravity.|For a circular orbit around a dominant mass it decreases as orbital radius increases.
`);
deck('D.2',String.raw`
Elementary charge|The magnitude of a proton's charge and of an electron's negative charge.|Ordinary isolated body charges occur in integer multiples of this magnitude.
Charge conservation|The principle that total electric charge of an isolated system remains constant.|Charging by friction transfers electrons rather than creating net charge.
Charge quantization|The observation that electric charge occurs in discrete multiples of an elementary unit.|Millikan's oil-drop results provide experimental evidence.
Electrostatic induction|Redistribution of charge in a body due to a nearby charged object.|Charging by induction can include grounding before the inducing object is removed.
Grounding|Connecting a body to Earth or another large charge reservoir.|Electrons can enter or leave while the connection is present.
Electric field strength|Force per unit positive test charge at a point.|A negative charge feels a force opposite to the field direction.
Permittivity|A property describing a medium's role in electric-field interactions.|A higher permittivity reduces Coulomb force for fixed charges and separation.
Electric potential|Electric potential energy per unit charge at a point.|It is scalar and may be positive, negative or zero.
Electronvolt|The energy corresponding to elementary charge moving through a potential difference of one volt.|It is an energy unit, not a voltage unit.
Equipotential conductor|A conductor in electrostatic equilibrium whose points have one potential.|Its internal electric field is zero without requiring zero potential.
Magnetic field line|A line whose tangent shows magnetic-field direction.|Magnetic field lines form closed loops.
Solenoid|A long coil whose current produces an approximately uniform interior magnetic field.|Its polarity follows the current direction and a right-hand grip rule.
`);
deck('D.3',String.raw`
Magnetic force|The force on moving charge or current due to a magnetic field.|It is perpendicular to velocity for a single moving charge.
Magnetic flux density|The magnetic field quantity B that sets force on a perpendicular moving charge or current.|Its SI unit is the tesla.
Tesla|A magnetic-flux-density unit equivalent to newton per ampere metre.|A 1 A perpendicular 1 m wire feels 1 N in a 1 T field.
Helical path|A path combining circular motion perpendicular to a magnetic field with uniform motion parallel to it.|Only the perpendicular velocity component sets the circular radius.
Velocity selector|Crossed electric and magnetic fields arranged to transmit particles of one speed undeflected.|For perpendicular opposing forces, the selected speed is E/B.
Charge-to-mass ratio|A particle's electric charge divided by its mass.|Field deflection combined with known speed or acceleration energy can determine its magnitude.
Mass spectrometer|An instrument using electric or magnetic forces to distinguish charged particles by mass-to-charge behaviour.|A selected speed and measured magnetic radius can identify mass differences.
Accelerating potential|A potential difference that transfers electric potential energy into a particle's kinetic energy.|Use the charge magnitude for the gained energy in an accelerating arrangement.
Conventional current|The direction of net positive charge flow used to define circuit current.|It is opposite to electron drift in a metal wire.
Parallel-current attraction|The magnetic attraction between parallel wires carrying currents in the same direction.|Opposite current directions produce repulsion.
Right-hand grip rule|A rule relating a current direction to the circulation of its magnetic field.|Point the right thumb along conventional current and curl fingers along field lines.
Magnetic rigidity|The momentum-to-charge ratio indicated by a particle's magnetic bending radius.|For perpendicular motion, the product Br equals momentum divided by charge magnitude.
`);
deck('D.4',String.raw`
Magnetic flux|Magnetic field multiplied by the perpendicular component of a surface's area.|Use the angle between field and surface normal in BA cos θ.
Weber|The SI unit of magnetic flux.|One weber is one tesla square metre.
Flux linkage|The sum of magnetic flux through all turns of a coil.|For identical flux per turn it is NΦ.
Electromagnetic induction|Production of an emf by changing magnetic flux linkage.|A constant large flux alone produces no emf.
Faraday’s law|Induced emf equals the negative rate of change of magnetic flux linkage.|Graphically, emf follows the negative slope of a flux-linkage-time graph.
Lenz’s law|An induced response acts to oppose the change that caused it.|It expresses energy conservation and does not always oppose the original field.
Motional emf|An emf produced as a conductor moves through a magnetic field.|For the perpendicular straight-conductor geometry its magnitude is BvL.
Induced current|Current driven around a closed circuit by an induced emf.|An open circuit can have emf without sustained current.
Generator|A device converting mechanical energy into electrical energy through electromagnetic induction.|A uniformly rotating coil produces sinusoidal emf in the ideal model.
Peak emf|The maximum magnitude of a time-varying emf.|For a rotating coil it is proportional to angular speed.
Self-induction|Induction of emf in a circuit by a change in its own current and magnetic field.|The induced emf opposes the current change.
Surface normal|A direction perpendicular to a surface.|It defines the angle used in the magnetic-flux equation.
`);
deck('E.1',String.raw`
Nucleus|The small dense central region of an atom containing protons and neutrons.|It contains nearly all the atom's mass and its positive charge.
Proton number|The number Z of protons in a nucleus.|It determines the chemical element.
Nucleon number|The total number A of protons and neutrons in a nucleus.|The number of neutrons is A−Z.
Isotope|A form of an element with a particular neutron number.|Isotopes share proton number but differ in nucleon number.
Ion|An atom or group with net charge due to electron loss or gain.|Ionization does not by itself change the nuclear proton number.
Energy level|An allowed discrete energy of an atomic or nuclear system.|A transition photon carries the difference between two levels.
Emission spectrum|A set of wavelengths emitted as a system makes downward energy transitions.|Atomic line patterns identify elements.
Absorption spectrum|A spectrum with missing wavelengths absorbed by matter from a continuous source.|The absorbed photons match allowed upward transition energies.
Ground state|The lowest available energy state of a system.|For hydrogen its energy is more negative than excited bound states.
Ionization energy|The minimum energy needed to remove an electron completely from a specified state.|In the Bohr model this raises the electron energy to zero.
Closest approach|The minimum separation reached by a repelled projectile in a scattering event.|For head-on scattering with target recoil neglected, initial kinetic energy becomes electric potential energy at the turning point.
Bohr model|A hydrogen model with quantized angular momentum and discrete electron energies.|It explains hydrogen line energies but is not a complete modern atomic model.
`);
deck('E.2',String.raw`
Photon|A quantum of electromagnetic radiation carrying energy hf.|Its momentum is h divided by wavelength.
Photoelectric effect|Emission of electrons from a material after absorption of sufficiently high-frequency light.|Below threshold frequency, ordinary emission does not occur regardless of intensity.
Photoelectron|An electron emitted from a material by the photoelectric effect.|Emitted electrons have a range of kinetic energies up to a maximum.
Work function|The minimum energy needed to remove an electron from a material's surface.|It depends on the material and surface condition.
Threshold frequency|The lowest incident light frequency that can produce photoelectric emission in the basic model.|Photon energy at threshold equals the work function.
Stopping potential|The minimum retarding potential difference that stops the most energetic photoelectrons.|Its magnitude times elementary charge equals maximum kinetic energy.
Saturation current|The photoelectric current when all emitted electrons are collected.|Above threshold it generally increases with incident intensity.
Wave–particle duality|The need for wave and particle descriptions to account for quantum observations.|Localized detections and diffraction patterns are complementary experimental features.
de Broglie wavelength|The wavelength associated with a particle of momentum p.|It equals h/p and decreases as momentum increases.
Electron diffraction|Spreading and interference of electron beams due to wave behaviour.|It provides evidence for matter waves.
Compton scattering|Scattering of a photon by an electron with energy and momentum transfer.|The scattered photon generally has a longer wavelength.
Compton wavelength|The scale h divided by electron rest mass times c in the electron Compton-shift formula.|Backscattering gives a wavelength increase twice this scale.
`);
deck('E.3',String.raw`
Mass defect|The difference between separated constituent mass and the mass of their bound nucleus.|Multiplying by c² gives the nuclear binding energy.
Binding energy|The energy required to separate a nucleus completely into its constituent nucleons.|It is also the energy released when that nucleus forms from separated nucleons.
Binding energy per nucleon|Total nuclear binding energy divided by nucleon number.|It is useful for comparing relative stability across the binding-energy curve.
Strong nuclear force|A short-range interaction between nucleons, attractive at typical nuclear separations but repulsive at very short distances.|Its limited range helps explain saturation of binding energy per nucleon.
Radioactive decay|A spontaneous random change of an unstable nucleus with emission of radiation.|Individual decay times cannot be predicted, but large populations follow statistical laws.
Alpha radiation|Helium-4 nuclei emitted by certain unstable nuclei.|It is strongly ionizing and weakly penetrating.
Beta-minus decay|A nuclear process converting a neutron to a proton with electron and antineutrino emission.|Nucleon number is unchanged and proton number increases by one.
Beta-plus decay|A nuclear process converting a proton to a neutron with positron and neutrino emission.|Nucleon number is unchanged and proton number decreases by one.
Gamma radiation|High-energy photons emitted when an excited nucleus loses energy.|Neither nucleon number nor proton number changes.
Activity|The number of nuclear decays per unit time.|One becquerel corresponds to one decay per second.
Half-life|The time for the number of undecayed nuclei or the activity to halve.|Subtract detector background before applying count-rate ratios.
Decay constant|The fractional decay rate λ in the exponential decay model.|It equals ln2 divided by half-life and has reciprocal-time units.
`);
deck('E.4',String.raw`
Nuclear fission|The splitting of a heavy nucleus into smaller nuclei with associated particles and energy.|Products are commonly more tightly bound per nucleon than the parent.
Neutron-induced fission|Fission triggered after a nucleus absorbs an incoming neutron.|The absorbed neutron must be included when balancing nucleon number.
Spontaneous fission|Fission occurring without an incident triggering particle.|It is one possible radioactive process for very heavy nuclei.
Fission fragment|One of the smaller nuclei produced in a fission event.|Fragments are often neutron-rich and radioactive.
Chain reaction|A sequence in which products of one reaction trigger further reactions.|Fission neutrons can induce subsequent fissions.
Critical state|A chain-reaction condition with a steady average fission rate.|On average one subsequent fission follows each fission after neutron losses.
Moderator|A reactor material used to slow neutrons through collisions.|It differs from a control rod, whose main role is neutron absorption.
Control rod|A neutron-absorbing reactor component used to regulate the chain reaction.|Greater insertion generally lowers the rate of further fission.
Coolant|A fluid carrying thermal energy away from the reactor core.|Its energy can be transferred to a separate circuit in a heat exchanger.
Heat exchanger|A component transferring thermal energy between systems or fluids.|It can keep a radioactive primary coolant separate from the turbine circuit.
Shielding|Material placed to reduce radiation reaching people or equipment.|Appropriate design depends on radiation type and energy.
Decay heat|Thermal power released by radioactive products after the main fission chain reaction stops.|Continued cooling may be needed even after shutdown.
`);
deck('E.5',String.raw`
Nuclear fusion|The joining of light nuclei to form heavier nuclei.|Energy is released when the products have greater binding energy per nucleon.
Hydrostatic equilibrium|The balance of inward gravitational effects and outward pressure gradients in a star.|A stable star can maintain this balance while energy flows outward.
Protostar|A contracting gas and dust object before stable core hydrogen fusion is established.|Gravitational contraction supplies much of its early radiated energy.
Main sequence|The band of stars undergoing sustained core hydrogen fusion on an HR diagram.|A star's initial mass strongly determines its position and lifetime.
Red giant|A luminous, relatively cool star with a greatly expanded radius.|Its high luminosity despite low surface temperature implies large emitting area.
Supergiant|A very large and luminous evolved star, commonly associated with high initial mass.|Some massive stars later undergo supernova collapse.
White dwarf|A compact hot stellar remnant with low luminosity because of its small radius.|It lies toward the hot faint region of an HR diagram.
Supernova|An extremely energetic stellar explosion associated with certain end stages or binary events.|A massive-star collapse can leave a neutron star or black hole.
Neutron star|A very compact stellar remnant supported by matter at extreme density.|It can remain after some massive-star supernovae.
Black hole|A region of spacetime with an event horizon beyond which light cannot escape to distant observers.|A sufficiently massive stellar remnant can collapse to one.
Stellar parallax|The apparent angular displacement of a nearby star due to a change in Earth's observing position.|The parallax angle is half the full six-month shift.
Parsec|The distance corresponding to a stellar parallax of one arcsecond.|Distance in parsecs equals the reciprocal of parallax in arcseconds.
`);
globalThis.FLASHCARDS=cards;
})();
